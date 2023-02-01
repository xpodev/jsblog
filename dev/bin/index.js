#!/usr/bin/env node

const fs = require("fs");

const cmd = process.argv[2];
const name = process.argv[3];

const packagesDir = `${process.cwd()}/packages`;
const packageDir = `${packagesDir}/${name}`;

const defaultPackageJson = {
    name: `@jsblog/${name}`,
    version: "1.0.0",
    description: "",
    main: "dist/index.js",
    author: "Xpo Development",
    license: "MIT",
};

const defaultTsConfig = {
    extends: "../tsconfig.json",
    compilerOptions: {
        target: "es5",
        lib: [
            "es5",
        ],
        module: "commonjs",
        outDir: "./dist",
        baseUrl: ".",
        declaration: true,
    },
    exclude: ["node_modules", "dist", "test/**/*", "*.spec.ts"],
    include: ["src/**/*"],
};

switch (cmd) {
    case "create":
    case "c":
        createPackage();
        break;
    case "build":
    case "b":
        buildPackage();
        break;
    case "delete":
    case "d":
        deletePackage();
        break;

    default:
        console.error(`Unknown command ${cmd}`);
        process.exit(1);
}

if (!fs.existsSync(packagesDir)) {
    fs.mkdirSync(packagesDir);
}

function str(obj) {
    return JSON.stringify(
        obj,
        function (k, v) {
            if (v instanceof Array) return JSON.stringify(v);
            return v;
        },
        2
    )
        .replace(/\\/g, "")
        .replace(/\"\[/g, "[")
        .replace(/\]\"/g, "]")
        .replace(/\"\{/g, "{")
        .replace(/\}\"/g, "}");
}

function createPackage() {
    if (fs.existsSync(packageDir)) {
        console.error(`Package ${name} already exists`);
        process.exit(1);
    }

    fs.mkdirSync(packageDir);

    fs.writeFileSync(
        `${packageDir}/package.json`,
        JSON.stringify(defaultPackageJson, null, 2)
    );
    fs.writeFileSync(
        `${packageDir}/tsconfig.json`,
        JSON.stringify(defaultTsConfig, null, 2)
    );

    fs.mkdirSync(`${packageDir}/src`);
    fs.writeFileSync(`${packageDir}/src/index.ts`, `// ${name}`);

    updateTsConfig();

}

function deletePackage() {
    if (!fs.existsSync(packageDir)) {
        console.error(`Package ${name} does not exist`);
        process.exit(1);
    }

    fs.rmSync(packageDir, { recursive: true });

    updateTsConfig();
}

function buildPackage() {
    // Do nothing
}

function updateTsConfig() {
    const paths = {};

    for (const dir of fs.readdirSync(packagesDir)) {
        if (!fs.statSync(`${packagesDir}/${dir}`).isDirectory()) {
            continue;
        }
        paths[`@jsblog/${dir}`] = [
            `../${dir}/src`,
            `./${dir}/src`,
            `../${dir}/dist`,
            `./${dir}/dist`,
        ];
        paths[`@jsblog/${dir}/*`] = [
            `../${dir}/src/*`,
            `./${dir}/src/*`,
            `../${dir}/dist/*`,
            `./${dir}/dist/*`,
        ];
    }

    for (const dir of fs.readdirSync(packagesDir)) {
        if (!fs.statSync(`${packagesDir}/${dir}`).isDirectory()) {
            continue;
        }
        const tsConfig = JSON.parse(
            fs.readFileSync(`${packagesDir}/${dir}/tsconfig.json`).toString()
        );
        tsConfig.compilerOptions.paths = paths;
        fs.writeFileSync(`${packagesDir}/${dir}/tsconfig.json`, str(tsConfig));
    }
}
