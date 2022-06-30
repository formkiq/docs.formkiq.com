# Gitpod

## Compiling using GitPod.io
make sure `antora-playbook.yml` has the local setting enabled
npm i -g @antora/cli@3.0.0 @antora/site-generator@3.0.0
make

## Run python http server (new terminal window)
python3 -m http.server --directory ./build/site
