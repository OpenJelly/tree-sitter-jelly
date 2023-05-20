// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "TreeSitterJelly",
    platforms: [.iOS(.v14)],
    products: [
        .library(name: "TreeSitterJelly", targets: ["TreeSitterJelly"]),
        .library(name: "TreeSitterJellyQueries", targets: ["TreeSitterJellyQueries"]),
        .library(name: "TreeSitterJellyRunestone", targets: ["TreeSitterJellyRunestone"]),

    ],
    dependencies: [
        .package(url: "https://github.com/simonbs/Runestone", from: "0.2.10")
    ],
    targets: [
        .target(name: "TreeSitterJelly", cSettings: [.headerSearchPath("src")]),
        .target(name: "TreeSitterJellyQueries", resources: [.copy("highlights.scm"), .copy("injections.scm")]),
        .target(name: "TreeSitterJellyRunestone", dependencies: ["Runestone", "TreeSitterJelly", "TreeSitterJellyQueries"]),
    ]
)
