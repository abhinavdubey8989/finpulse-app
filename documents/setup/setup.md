
Local env setup
- install NVM on mac : `https://stackoverflow.com/questions/77594827/how-to-install-nvm-on-mac`
- check nvm version : `nvm --version`
- install specific node version

```
# list remote node versions
nvm ls-remote
nvm ls-remote --lts # for only stable versions

# install
nvm install 20.19.4

# use 
nvm use 20.19.4

# verify
node -v
npm -v
```