const subProcess = require("child_process");
const ghpages = require("gh-pages");

const buildDir = "dist";

const lastCommitCommand = 'git log --pretty="%H" -- .';
subProcess.exec(lastCommitCommand, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  const hash = stdout.split("\n")[0];
  ghpages.publish(
    buildDir,
    {
      message: `build from ${hash}`,
      dotfiles: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
});
