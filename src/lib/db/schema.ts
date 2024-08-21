import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(), // Every Chat will have a unique id
  pdfName: text("pdf_name").notNull(), // The name of the pdf file we uploaded
  pdfUrl: text("pdf_url").notNull(), // The url of the pdf file we uploaded
  createdAt: timestamp("created_at").notNull().defaultNow(), // The time the chat was created and default to now so that whenever we create a new chat timestamp will automatically get created
  userId: varchar("user_id", { length: 256 }).notNull(), // The id of the user who created the chat
  fileKey: text("file_key").notNull(), // The key of the pdf file we uploaded. It will be used to locate the pdf file in S3
});
