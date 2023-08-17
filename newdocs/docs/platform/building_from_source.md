---
sidebar_position: 7
---

# Building from Source

FormKiQ-Core was built using Java and JavaScript languages. In order to build from source you will need to install the development tools listed below.

## Required Development Tools

* *JDK 11+*: (https://openjdk.java.net)
* *Gradle 6.7+*: (https://gradle.org)
* *NodeJS 6+*: (https://nodejs.org)
* *Docker 3.0.0+*: (https://www.docker.com/products/docker-desktop)
* *AWS CLI 2.1+*: https://aws.amazon.com/cli
* *AWS SAM 1.15+*: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
* *YTT 0.40.1+*: https://github.com/vmware-tanzu/carvel-ytt

## Running Build

FormKiQ-Core uses https://gradle.org as the main build tool.

To compile:

```
./gradlew clean build
```

:::note
An example of using https://docs.github.com/en/actions to build FormKiQ can be found https://github.com/formkiq/formkiq-core/blob/master/.github/workflows/gradle.yml.
:::