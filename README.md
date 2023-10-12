## **Unigov-Sim: Proposal Simulation Tool**

### **Introduction**

**Unigov-Sim** is a one-stop solution to visualize and forecast the outcomes of proposals before submitting them a Governor Bravo's implementation. We provide a smooth interface, along with automated abi parsing for target contracts and type checking for functions called in your proposal.

### **Quick Start**

To get started with your simulation service, utilize this quick one-liner:

<!-- Reqs make sure node 18+ is installed, nvm use --lts to install node 18 -->

Requirements:

- Node 18+ (
  [install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and then run `nvm use --lts` to uprade to node 18.)
- Npm 8+

```bash
npx create unigov-sim@latest
```

Follow the intuitive steps to add your api keys and governance contract to get started.

### **Features**

- **Intuitive UI**: Navigate through multiple steps with ease, back and forth.
- **Smart Error Handling**: Make sure your account is connected and has the right permissions before submitting your proposal.
- **Dynamic ABI Parsing**: Parse and display the functions for every contract you add to your proposal.
- **Enhanced Simulation**: Simulate the outcome of your proposal including state changes and events triggered.

### Links

- Live Site URL: [Here](https://playground.unigov.live/)

## Author

- Aiden A. (https://github.com/0xaaiden/)
