---
sidebar_position: 9
---

# Building from Source

FormKiQ-Core is built using Java and JavaScript. This guide walks you through setting up your development environment and building the project from source.

## Development Prerequisites

The following tools are required to build FormKiQ-Core:

| Tool | Version | Purpose | Download |
|------|---------|----------|-----------|
| JDK | 11+ | Java Development Kit | [OpenJDK](https://openjdk.java.net) |
| Gradle | 6.7+ | Build Automation | [Gradle](https://gradle.org) |
| NodeJS | 6+ | JavaScript Runtime | [NodeJS](https://nodejs.org) |
| Docker | 3.0.0+ | Containerization | [Docker Desktop](https://www.docker.com/products/docker-desktop) |
| AWS CLI | 2.1+ | AWS Command Line Interface | [AWS CLI](https://aws.amazon.com/cli) |
| AWS SAM | 1.15+ | Serverless Application Model | [SAM CLI Install Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) |
| YTT | 0.40.1+ | YAML Templating | [Carvel YTT](https://github.com/vmware-tanzu/carvel-ytt) |

## Build Process

FormKiQ-Core uses Gradle as its primary build tool.

### Basic Build

To compile the project:

```bash
./gradlew clean build
```

### Automated Build Example

You can find an example GitHub Actions workflow that builds FormKiQ in our repository:
[FormKiQ Build Workflow](https://github.com/formkiq/formkiq-core/blob/master/.github/workflows/gradle.yml)

:::note
The GitHub Actions workflow provides a complete example of our CI/CD process, including build steps, testing, and deployment configurations.
:::

### Build Verification

After building, verify your build by checking:
1. Build output for any errors
2. Test results in the build reports
3. Generated artifacts in the build directory

## Troubleshooting

Common build issues and solutions:

1. **Java Version Mismatch**
   - Ensure JAVA_HOME points to JDK 11+
   - Verify Java version with `java -version`

2. **Gradle Issues**
   - Clear Gradle cache if needed: `./gradlew --stop`
   - Run with debug: `./gradlew build --debug`

3. **Environment Setup**
   - Verify all required tools are in your PATH
   - Check tool versions match requirements