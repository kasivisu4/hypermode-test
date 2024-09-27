import { models } from "@hypermode/functions-as";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/models-as/models/openai/chat";
import * as duckdb from "duckdb";
const db = new duckdb.Database(
  ":memory:",
  {
    access_mode: "READ_WRITE",
    max_memory: "512MB",
    threads: "4",
  },
  (err) => {
    if (err) {
      console.error(err.toString());
    }
  },
);

const modelName = "text-generator";

export async function generateQuery(text: string): string {
  const model = models.getModel<OpenAIChatModel>(modelName);

  const input = model.createInput([
    new SystemMessage(
      "convert the given text to a sql query that just transforms without data. For instance, what is 2 + 2? should be converted to SELECT 2 + 2;",
    ),
    new UserMessage(text),
  ]);

  input.temperature = 0.7;
  input.maxTokens = 200;

  const output = model.invoke(input);

  // Wait for the DB query to complete using async/await
  const dbResult = await db.all(output.choices[0].message.content.trim());

  // Combine the output and the db result into a string
  return `Generated Query: ${output.choices[0].message.content.trim()}, DB Result: ${dbResult}`;
}
