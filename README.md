# JS Blog
A lightweight blog engine written in TypeScript.

## Installation
**NOTE**: THIS IS NOT PUBLISHED YET SO DON'T EXPECT IT TO WORK!

npm
```bash
npm install @jsblog/core
```
yarn
```bash
yarn add @jsblog/core
```

## Usage
```js
const { Blog } = require('@jsblog/core');
const { MongoAdapter } = require('@jsblog/mongodb');

const adapter = new MongoAdapter({
  uri: 'mongodb://localhost:27017/jsblog',
});
const blog = new Blog({
    adapter,
});

blog.init().then(() => {
  blog.createPost({
    title: 'Hello World',
    content: 'This is my first post!',
  });
});
```

## Adapters
The core package only provides the basic functionality of the blog engine. To use a database, you need to install an adapter. The following adapters are available:
### MongoDB
```bash
npm install @jsblog/mongodb
```
### MySQL
```bash
npm install @jsblog/mysql
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Development
```bash
git clone
cd jsblog
yarn
yarn build:dev
```

### Add new package
If you want to add a new package, you can use the `tttt` cli tool. It will create a new package with the correct folder structure and files, also it will add the package to the tsconfig.json file.
```bash
yarn global add ./dev
```
```bash
tttt create <package-name>
```
