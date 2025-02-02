# DevLensia

**Devlensia** is a **web-based tool** for easy exploration of **GitHub profiles**, **repositories**, and **commits**. Perfect for **developers**, **security professionals**, and **OSINT enthusiasts**, it utilizes the **GitHub API**, bypasses API restrictions with **CORS proxies**, and boosts performance with **local caching**. **Devlensia** simplifies your workflow and strengthens your **research capabilities**.

# 🔧 Features

| **Feature**                             | **Description**                                                                                           |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------|
| 👤 **GitHub User Lookup**               | Fetch detailed GitHub user information, including avatar, bio, profile links and more.                     |
| 📁 **Repository Explorer**              | List all non-forked repositories of a user.                                                               |
| 📝 **Recent Commits Viewer**            | Retrieve and display the latest commits from each repository.                                             |
| 🌐 **CORS Proxy Rotation**              | Use multiple proxies to bypass GitHub API restrictions and rotate them when needed.                       |
| 💾 **Local Caching**                    | Reduce API calls by storing responses locally for quicker access.                                         |
| ⚠️ **Error Handling & Rate Limit Management** | Detect API rate limits and automatically switch proxies when necessary.                                  |

# 💻 Technology Stack

- ⚛️ **React.js**
- 📝 **Typescript**
- 🎨 **Tailwind CSS**
- 🖥️ **GitHub REST API**
- 🔒 **CORS Proxy**
- 🐳 **Docker**

# 🚀 Installation

To install and run Devlensia, follow one of the two methods below:

## 🧑‍💻 Method 1: Git Clone

1. **Clone the repository**:
   
   ```bash
   git clone https://github.com/iqlipx/DevLensia.git
   
   cd DevLensia
   ```
2. **Install dependencies** - Ensure you have **Node.js** installed. Then run:
     ```bash
     npm install
    ```
3. Run the application:
   ```bash
   npm run dev
   ```
4. The application should now be running at http://localhost:5173.


## 🐳 Method 2: Docker Pull

1. **Pull the Docker image**:

   ```bash
   docker pull iqlip/devlensia:latest
   ```
2. **Run the Docker container**:
   
   ```bash
   docker run -p 3000:3000 -p 8080:8080 iqlip/devlensia:latest
   ```
3. The application should now be running at http://localhost:3000.


# 🛠️ Usage

1. 🌐 **Open the application** in your web browser:
    - For the **Git clone installer**, go to [http://localhost:5173](http://localhost:5173).
    - For the **Docker pull installer**, go to [http://localhost:3000](http://localhost:3000).

2. 🔍 **Enter a GitHub username** in the search input field.

3. ➡️ **Click the "Search" button** or press **Enter**.

4. 📜 **View the user's profile**, repositories, and the latest commits.


## 📸 Screenshots

Take a look at the application in action:

1. **GitHub User Lookup**:  

   View detailed GitHub user information, including the avatar, bio, profile links, and more.
   
   ![GitHub User Lookup](/images/profile.png)

3. **Original Repositories**:  

   Explore all non-forked repositories of the user.
   
   ![Repository Explorer](/images/repo.png)

4. **Recent Commits**:
   
   See the latest commits from each repository.
   
   ![Recent Commits Viewer](/images/commits.png)


## 📂 Directory Structure

```
📁 DevLensia/
├── 📄 README.md
├── 📄 Dockerfile
├── 📄 eslint.config.js
├── 📄 index.html
├── 📄 package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
├── 📄 vite.config.ts
├── 📁 images/
├── 📁 media/
└── 📁 src/
    ├── 📄 App.tsx
    ├── 📄 github.ts
    ├── 📄 index.css
    ├── 📄 main.tsx
    ├── 📄 proxy.ts
    ├── 📄 types.ts
    └── 📄 vite-env.d.ts

```


## 💡 Contributions and Issues

Contributions are welcome! There are many ways you can help improve **Devlensia**. If you're unsure how to contribute or get stuck, feel free to tag @thor (thunder0411), or join our Discord server [Crimson Command Center](https://discord.gg/WqRGvUwFFr)✨.

Please ensure that all contributions align with ethical practices. If you encounter any issues or bugs, please report them on the [GitHub repository](https://github.com/iqlipx/DevLensia/issues).



## ✨ Contributors

🌟 Special thanks to these amazing contributors for their support and contributions: 🌟

<table>
  <tr>
    <td align="center"><a href="https://github.com/thunder0411"><img src="https://avatars.githubusercontent.com/u/76962355?v=4" width="100px;" alt=""/><br /><sub><b>thunder0411</b></sub></a></td>
  </tr>
</table>


## ⚠️ Disclaimer

The developers of **Devlensia** are not responsible for any misuse of this tool. It is intended for ethical use only. Use at your own risk.






