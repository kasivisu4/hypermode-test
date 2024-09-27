import { models } from "@hypermode/functions-as";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/models-as/models/openai/chat";
const modelName = "text-generator";

// import * as duckdb from '@duckdb/duckdb-wasm';

// const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

export function generateQuery(text: string): string {
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

  return output.choices[0].message.content.trim();
}
