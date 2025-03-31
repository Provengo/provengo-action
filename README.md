# `actions/Provengo`

Run your Provengo project in GitHub action easily.

[Provengo](https://provengo.tech/) is a tool for specifying and testing software systems.

> [!IMPORTANT]
> currently runing on Unix only


## Usage

### Basic Example

```yaml
jobs:
  run-download-action:
    runs-on: ubuntu-latest
    steps:
      # checks-out the repository inorder to access provengo project.     
      - name: Checkout code
        uses: actions/checkout@v2
           
      - name: install provengo
        uses: actions/provengo

      - name: run provengo
        run: provengo run provengo/provengo-project
```
this example is clone github code, then run prvengo project. 


---

### Full Example

```yaml
jobs:
  run-download-action:
    runs-on: ubuntu-latest
    steps:
      # checks-out the repository inorder to access provengo project.
      - name: Checkout code
        uses: actions/checkout@v2

      - name: install provengo
        uses: actions/provengo

      - name: sample
        run: provengo sample provengo/provengo-project

      - name: ensemble
        run: provengo ensemble provengo/provengo-project

      - name: run ensemble 
        run: provengo run -s products/run-source/ensemble.json provengo/provengo-project

      - name: report
        run: provengo report provengo/provengo-project

      - name: save report for later use
        uses: actions/upload-artifact@v4
        with:
          name: report
          path: provengo/provengo-project/products/reports```
```

create sample &rarr; create ensemble &rarr; run ensemble output &rarr; create report &rarr; save report. 

