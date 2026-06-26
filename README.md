<div align="center">
  <img
    width="700"
    alt="Music Stats Preview"
    src="https://github.com/user-attachments/assets/e51fb607-290b-4a51-992b-47dc08014474"
  />

# Music Stats
</div>

---

## spicetify-music-stats

**Music Stats** is a custom app for <a href="https://github.com/spicetify">Spicetify</a> that provides detailed insights into your listening habits on Spotify. It features a dynamic, responsive interface and presents your favorite artists, albums, tracks, genres, and other listening statistics in a clean and intuitive way.

The idea for this project came from my desire to better understand my own listening habits. While exploring the Spicetify community, I discovered <a href="https://github.com/harbassan">Harbassan</a>'s excellent <a href="https://github.com/harbassan/spicetify-apps/tree/main/projects/stats">Stats</a> app, which inspired several concepts used in this project.

Although **Music Stats** is still evolving, it has its own identity and goals. Many features are original, while others were inspired by existing ideas and reimagined with a different user experience in mind.

---

##  Preview

Take a look at some parts of the application interface.

| Overview | Artists |
| :-------: | :------: |
| <img width="1280" height="987" alt="OverView" src="https://github.com/user-attachments/assets/db592bd4-251d-4cb1-877e-ec9287f222f4" />| <img width="1280" height="993" alt="Artist-Page" src="https://github.com/user-attachments/assets/7345e9f9-1076-4f22-b112-2d8f2a2db23e" />|

| Albums | Tracks |
| :------: | :------: |
| <img width="1279" height="989" alt="Album-Page" src="https://github.com/user-attachments/assets/c685abe6-f3a8-4614-826c-373ebadb4876" />| <img width="1280" height="990" alt="Songs-Page" src="https://github.com/user-attachments/assets/ddaf7f3f-c5d6-4ca2-a15c-09a0f7c8de4b" />|


---

## IndexedDB

Music Stats uses **IndexedDB** to cache Spotify data locally, improving performance and reducing unnecessary network requests.

Instead of fetching the same information every time the application is opened, previously retrieved data is stored and reused whenever possible. This makes navigation much faster and provides a smoother user experience.

### Benefits

-  Faster loading after the first access.
-  Reduced number of API requests.
-  Instant navigation between pages.
-  Automatic cache updates when needed.

---

##  Installation

### Prerequisites

Before installing **Music Stats**, make sure you already have **Spicetify** installed and configured correctly.

---

### 1. Clone the repository

Clone this repository to your local machine.

```bash
git clone https://github.com/vitorhugo8899o-lgtm/spicetify-music-stats
```

---

### 2. Locate your Spicetify configuration directory

Open a terminal and run:

```bash
spicetify config-dir
```

This command will print the path to your Spicetify configuration directory.

---

### 3. Install the app

Inside the Spicetify configuration directory, open the `CustomApps` folder and copy the `musicstats` folder from this repository into it.

Your directory structure should look like this:

```text
Spicetify/
└── CustomApps/
    └── musicstats/
        ├── manifest.json
        ├── index.js
        ├── extension.js
        └── ...
```

---

### 4. Enable the custom app

Run the following command:

```bash
spicetify config custom_apps musicstats
```

---

### 5. Apply the changes

Finally, apply the new configuration:

```bash
spicetify apply
```

Spotify will restart automatically, and **Music Stats** will be available in the left sidebar.
-  Persistent local storage, even after restarting Spotify.

The cache is managed automatically, requiring no configuration from the user.

---

<br/>

## Contributing

Contributions are highly welcome! You are free to modify, tweak, change anything and create your own version based on this project. If you choose to build your own version, please remember to give credit to this original repository.

To contribute directly to this project, please follow these guidelines:


- 1 Fork the repository to your own GitHub account.

- 2 Create a separate branch for any modifications:

```bash
  git checkout -b feat/my-new-feature
```

- 3 Commit your changes remembering to add conventional prefixes (feat:, fix:, etc.):
```bash
  git commit -m "feat: add a new widget"
```

- 4 Push the branch to your fork:
```bash
  git push origin feat/my-new-feature
```

- 5 Open a Pull Request explaining your changes.
