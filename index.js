import { Client } from "@notionhq/client";
import schedule from "node-schedule";
import dotenv from "dotenv";
dotenv.config();
const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;
console.log("databaseId: ", databaseId);
const job = schedule.scheduleJob("0 0 * * *", function () {
  addItem("Yurts in Big Sur, California");
});
async function addItem(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
        record: {
          checkbox: false,
        },
        Tags: {
          multi_select: [
            {
              name: "Mon",
            },
            {
              name: "Sun",
            },
          ],
        },
      },
    });
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body);
  }
}
