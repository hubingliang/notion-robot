import { Client } from "@notionhq/client";
import schedule from "node-schedule";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();
const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;
const skills = [
  "Two feel & Four beat",
  "Chord arpeggio",
  "Lonian",
  "Dorian",
  "Phrygian",
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian",
  "Altered",
  "Lydian b7",
  "Bebop",
];
const standards = [
  "Autumn Leaves",
  "Billie's Bounce",
  "Beautiful Love",
  `Take The "A" Train`,
  "Fly Me To The Moon",
];

export const random = (arr) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};
const addTask = async () => {
  try {
    const standard = random(standards);
    const skill = random(skills);
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: standard,
              },
            },
          ],
        },
        "Skill training": {
          multi_select: [
            {
              name: skill,
            },
          ],
        },
        Record: {
          checkbox: false,
        },
        Date: {
          date: {
            start: moment(),
          },
        },
      },
    });
  } catch (error) {
    console.log("error: ", error);
    console.error(error.body);
  }
};
const getAllTasks = async () => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.error(error.body);
  }
};
const archivedPage = async (task) => {
  try {
    const response = await notion.pages.update({
      page_id: task.id,
      archived: true,
    });
  } catch (error) {
    console.error(error.body);
  }
};
const main = async () => {
  // const tasks = await getAllTasks();
  // tasks.map(async (task) => {
  //   await archivedPage(task);
  // });
  await addTask();
};
// main();
const job = schedule.scheduleJob("* * * *", async () => {
  await addTask();
  console.log("Success set task at", moment().format("dddd"));
});
