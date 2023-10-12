## **Unigov-Sim: Proposal Simulation Tool**


**Unigov-Sim** is a one-stop app to simulate the outcomes of proposals before submitting them to Governor Bravo implementation. We provide a smooth interface, along with automated ABI parsing for target contracts and type checking for functions supported.

### **Quick Start**
Requirements:

- Node 18+ (
  [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and then run `nvm use --lts` to uprade to node 18.)
- Npm 8+

<!-- Reqs make sure node 18+ is installed, nvm use --lts to install node 18 -->


To get started, utilize this quick one-liner setup:

```bash
npx create unigov-sim@latest
```


Follow the steps to add your API keys and Governance contract address to get started.

### **Features**

- **Intuitive UI**: Navigate through multiple steps with ease, back and forth, make edits to your proposals without losing state.
- **Smart Error Handling**: It verifies your account is connected and has enough votes to submit the proposal.
- **Dynamic ABI Parsing and Input Typings**: Parse and display the functions for verified target contracts.
- **Enhanced Simulation**: Simulate the outcome of your proposal and visualize state changes and events triggered on chain.

### Links

- Live Site URL: [https://playground.unigov.live/](https://playground.unigov.live/)

## Author

- Aiden A. (https://github.com/0xaaiden/)
