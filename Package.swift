// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "TreeSitterJelly",
    products: [
        .library(name: "TreeSitterJelly", targets: ["TreeSitterJelly"]),
        .library(name: "TreeSitterJellyQueries", targets: ["TreeSitterJellyQueries"]),
    ],
    targets: [
        .target(name: "TreeSitterJelly",
                path: ".",
                exclude: [
                    "bindings/",
                    "queries",
                    "src/grammar.json",
                    "src/node-types.json",
                    "binding.gyp",
                    "Cargo.lock",
                    "Cargo.toml",
                    "example-file.jelly",
                    "grammar.js",
                    "LICENSE",
                    "package-lock.json",
                    "package.json",
                    "Package.resolved"
                ],
                sources: [
                    "src/parser.c",
                    "src/scanner.c"
                ],
                cSettings: [
                    .headerSearchPath("src")
                ]),
        .target(name: "TreeSitterJellyQueries",
                path: "queries",
                resources: [
                    .copy("highlights.scm"),
                        .copy("injections.scm")
                ]),
    ]
)
