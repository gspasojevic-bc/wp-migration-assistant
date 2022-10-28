## WP Migration Assistant

1. Clone site to your local instance using WP All in One Migration.
2. Place <code>assistant.js</code> and <code>package.json</code> next to your <code>./public</code> folder.
3. Edit <code>assistant.js</code> and enter git repo path in the constant <code>GIT_REPO_PATH</code>.
   2. Use either regular HTTPS repo path or even better SSH path to automate entire process.
4. Run terminal <code>npm install</code>.
5. Run terminal <code>node assistant.js</code>.
6. Your local WP instance is now pulled from GIT and set to <code>master</code> branch.