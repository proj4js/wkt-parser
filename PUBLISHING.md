# Publishing

Make sure you have the latest from the main branch:

    git pull origin main

Use `npm version` to update the version number in the `package.json`, then commit and push the change:

    npm version {patch|minor|major} --no-git-tag-version
    git commit -am "Set version to $(node -p "require('./package.json').version")"
    git push origin main

Then run the publish script:

    ./publish.sh

It builds on a temporary `build` branch, tags the build commit as `v<version>`, pushes the tag, publishes to npm, and deletes the `build` branch.
