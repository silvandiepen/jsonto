import prettier from "prettier";
import { runJsonTo } from "./build";
import { loadFile } from "./helpers/load";

describe("Sass - isCssFunction", () => {
  it("Var is a css function", async () => {
    const result = await loadFile("test/expected-output.scss");
    await runJsonTo({
      input: "test/default.json",
      output: "temp/default.script.scss",
      template: "template/default.template",
    });
    const build = await loadFile("temp/default.script.scss");
    console.log(build);
    expect(prettier.format(build)).toEqual(prettier.format(result));
  });
});
