const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const tutorial = fs.readFileSync('docs/tutorials/Java/documents-api.md', 'utf8');
const version = tutorial.match(/<artifactId>client<\/artifactId>\s*<version>([\d.]+)<\/version>/)?.[1];
if (!version) throw new Error('Missing Java SDK version in the tutorial');
const example = [...tutorial.matchAll(/```java\n([\s\S]*?)\n```/g)].map(match => match[1]).join('\n\n');
if (!example.includes('public class FormKiQJavaSdkExample')) throw new Error('Missing Java example');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'formkiq-java-tutorial-'));
try {
  const source = path.join(directory, 'src/main/java');
  fs.mkdirSync(source, {recursive: true});
  fs.writeFileSync(path.join(source, 'FormKiQJavaSdkExample.java'), example);
  fs.writeFileSync(path.join(directory, 'pom.xml'), `<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion><groupId>com.formkiq.docs</groupId>
    <artifactId>java-tutorial</artifactId><version>1</version>
    <properties><maven.compiler.release>11</maven.compiler.release><project.build.sourceEncoding>UTF-8</project.build.sourceEncoding></properties>
    <dependencies><dependency><groupId>com.formkiq</groupId><artifactId>client</artifactId><version>${version}</version></dependency></dependencies>
    <build><plugins><plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-compiler-plugin</artifactId><version>3.14.1</version></plugin></plugins></build>
  </project>`);
  execFileSync('mvn', ['--batch-mode', '--no-transfer-progress', '-f', path.join(directory, 'pom.xml'), 'compile'], {stdio: 'inherit'});
} finally {
  fs.rmSync(directory, {recursive: true, force: true});
}
