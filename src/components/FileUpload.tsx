"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getEmbeddings } from "@/lib/embeddings";
import md5 from "md5";
import { Document } from "@pinecone-database/doc-splitter";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/data";
import { PineconeRecord } from "@pinecone-database/pinecone";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ([file_key, file_name]: [
      file_key: string,
      file_name: string
    ]) => {
      const response = await axios.post("api/create-chat", {
        file_key,
        file_name,
      });
      const documents = response.data.documents;
      const vectors = await Promise.all(documents.flat().map(embedDocument));

      const pinecone_upload_response = await axios.post(
        "api/upload-to-pinecone",
        {
          file_key,
          file_name,
          vectors,
        },
      );
      console.log(pinecone_upload_response.data);

      return pinecone_upload_response.data;
    },
  });
  async function embedDocument(doc: Document) {
    try {
      const embeddings = await getEmbeddings(doc.pageContent);
      const hash = md5(doc.pageContent);
      return {
        id: hash,
        values: embeddings,
        metadata: {
          text: doc.metadata.text,
          pageNumber: doc.metadata.pageNumber,
        },
      } as PineconeRecord;
    } catch (error) {
      console.log("error while embedding", error);
      throw error;
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb
        toast.error("File size must be less than 10MB");
        return;
      }

      // upload to s3
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error("Something went wrong while uploading to S3");
          return;
        }
        // const plainData = JSON.parse(JSON.stringify(data));
        mutate([data.file_key, data.file_name], {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (error) => {
            toast.error("Error while creating chat");
            console.log("Error in FileUpload.tsx -> mutate -> onError:", error);
          },
        });
      } catch (error) {
        console.log("Error in FileUpload.tsx -> onDrop -> catch block:", error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
