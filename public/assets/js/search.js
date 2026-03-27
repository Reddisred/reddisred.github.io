//////////////////////////////
///          Init          ///
//////////////////////////////
import { BareMuxConnection } from "https://unpkg.com/@mercuryworkshop/bare-mux@2.1.7/dist/index.mjs";
//////////////////////////////
///         Options        ///
//////////////////////////////
const connection = new BareMuxConnection("/bareworker.js");

let wispURL;
let transportURL;

 let tabCounter = 0;
 let currentTab = 0;
 let framesElement;
 let currentFrame;
 const addressInput = document.getElementById("address");

requestIdleCallback(async () => {
  await import(`/scram/scramjet.all.js`);

  const { ScramjetController } = window.$scramjetLoadController();

  const scramjet = new ScramjetController({
    files: {
      wasm: `/scram/scramjet.wasm.wasm`,
      all: `/scram/scramjet.all.js`,
      sync: `/scram/scramjet.sync.js`,
    },
    siteFlags: {
      "https://www.google.com/(search|sorry).*": {
        naiiveRewriter: true,
      },
    },
  });

  scramjet.init();
  window.scramjet = scramjet;
});
const transportOptions = {
  epoxy:
    "https://unpkg.com/@mercuryworkshop/epoxy-transport@2.1.27/dist/index.mjs",
  libcurl:
    "https://unpkg.com/@mercuryworkshop/libcurl-transport@1.5.0/dist/index.mjs",
};

//////////////////////////////
///           SW           ///
//////////////////////////////
const stockSW = "./ultraworker.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

/**
 * Registers the service worker if supported and allowed.
 * @returns {Promise<void>}
 * @throws Will throw if service workers are unsupported or not HTTPS on disallowed hosts.
 */
async function registerSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    ) {
      const msg = "Service workers cannot be registered without https.";
      alert(msg);
      throw new Error(msg);
    }

    const msg = "Your browser doesn't support service workers.";
    alert(msg);
    throw new Error(msg);
  }

  try {
    await navigator.serviceWorker.register(stockSW);
  } catch (err) {
    alert(`Service worker failed to register: ${err.message}`);
    throw err;
  }
}
if (window.self === window.top) {
  await registerSW();
  console.log("lethal.js: Service Worker registered");
}

//////////////////////////////
///        Functions       ///
//////////////////////////////

/**
 * Creates a valid URL from input or returns a search URL.
 * @param {string} input - The input string or URL.
 * @param {string} [template="https://search.brave.com/search?q=%s"] - Search URL template.
 * @returns {string} Valid URL string.
 */
// Store the search engine template
localStorage.setItem("searchEngine", "https://duckduckgo.com/?q=%s");

// Function to make a URL
 function makeURL(input, template) {
  // Use the template from argument or localStorage
  template = template || localStorage.getItem("searchEngine");

  try {
    // Try treating the input as a URL
    return new URL(input).toString();
  } catch (err) {
    // If invalid URL, treat as search query
    return template.replace("%s", encodeURIComponent(input));
  }
}

/**
 * Updates BareMux connection with current transport and wisp URLs.
 * @returns {Promise<void>}
 */
async function updateBareMux() {
  if (transportURL != null && wispURL != null) {
    console.log(
      `lethal.js: Setting BareMux to ${transportURL} and Wisp to ${wispURL}`
    );
    await connection.setTransport(transportURL, [{ wisp: wispURL }]);
  }
}

/**
 * Sets the transport URL and updates BareMux.
 * @param {string} transport - Transport name or URL.
 * @returns {Promise<void>}
 */
 async function setTransport(transport) {
  console.log(`lethal.js: Setting transport to ${transport}`);
  transportURL = transportOptions[transport] || transport;
  await updateBareMux();
}

/**
 * Gets the current transport URL.
 * @returns {string | undefined}
 */
 function getTransport() {
  return transportURL;
}

/**
 * Sets the wisp URL and updates BareMux.
 * @param {string} wisp - Wisp URL.
 * @returns {Promise<void>}
 */
 async function setWisp(wisp) {
  console.log(`lethal.js: Setting Wisp to ${wisp}`);
  wispURL = wisp;
  await updateBareMux();
}

/**
 * Gets the current wisp URL.
 * @returns {string | undefined}
 */
 function getWisp() {
  return wispURL;
}

/**
 * Gets the proxied URL
 * @param {string} input - The input URL or hostname.
 * @returns {Promise<string>}
 */
 async function proxySJ(input) {
  const url = makeURL(input);
  return scramjet.encodeUrl(url);
}
 async function proxyUV(input) {
  const url = makeURL(input);
  return __uv$config.prefix + __uv$config.encodeUrl(url);
}

/**
 * Sets the container element for frames.
 * @param {HTMLElement} frames - The frames container element.
 */
 function setFrames(frames) {
  framesElement = frames;
}

/**
 * Class representing a browser tab with its own iframe.
 */
 class Tab {
  /**
   * Creates a new tab with an iframe and appends it to frames container.
   */
  constructor() {
    tabCounter++;
    this.tabNumber = tabCounter;

    this.frame = document.createElement("iframe");
    this.frame.setAttribute("class", "w-full h-full border-0 fixed");
    this.frame.setAttribute("title", "Proxy Frame");
    this.frame.setAttribute("src", "/newtab");
    this.frame.setAttribute("loading", "lazy"); 
    this.frame.setAttribute("id", `frame-${tabCounter}`);
    framesElement.appendChild(this.frame);

    this.switch();

    this.frame.addEventListener("load", () => this.handleLoad());

    document.dispatchEvent(
      new CustomEvent("new-tab", {
        detail: { tabNumber: tabCounter },
      })
    );
  }

  /**
   * Switches to this tab, hiding other iframes and updating the address input.
   */
  switch() {
    currentTab = this.tabNumber;
    const frames = document.querySelectorAll("iframe");
    [...frames].forEach((frame) => frame.classList.add("hidden"));
    this.frame.classList.remove("hidden");

    currentFrame = document.getElementById(`frame-${this.tabNumber}`);

    addressInput.value = decodeURIComponent(
      this.frame?.contentWindow?.location.href.split("/").pop()
    );

    document.dispatchEvent(
      new CustomEvent("switch-tab", {
        detail: { tabNumber: this.tabNumber },
      })
    );
  }

  /**
   * Closes this tab by removing its iframe and dispatching a close event.
   */
  close() {
    this.frame.remove();

    document.dispatchEvent(
      new CustomEvent("close-tab", {
        detail: { tabNumber: this.tabNumber },
      })
    );
  }

  /**
   * Handles iframe load event: updates history and address input.
   */
  handleLoad() {
    let url = decodeURIComponent(
      this.frame?.contentWindow?.location.href.split("/").pop()
    );
    let title = this.frame?.contentWindow?.document.title;

    let history = localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history"))
      : [];
    history = [...history, { url, title }];
    localStorage.setItem("history", JSON.stringify(history));

    document.dispatchEvent(
      new CustomEvent("url-changed", {
        detail: { tabId: currentTab, title, url },
      })
    );

    if (url === "newtab") url = "bromine://newtab";
    addressInput.value = url;
  }
}

/**
 * Creates a new tab.
 * @returns {Promise<void>}
 */
 async function newTab() {
  new Tab();
}

/**
 * Switches to the specified tab number.
 * @param {number} tabNumber - Tab number to switch to.
 */
 function switchTab(tabNumber) {
  const frames = document.querySelectorAll("iframe");
  [...frames].forEach((frame) => {
    frame.classList.toggle("hidden", frame.id !== `frame-${tabNumber}`);
  });

  currentTab = tabNumber;
  currentFrame = document.getElementById(`frame-${tabNumber}`);

  addressInput.value = decodeURIComponent(
    currentFrame?.contentWindow?.location.href.split("/").pop()
  );

  document.dispatchEvent(
    new CustomEvent("switch-tab", {
      detail: { tabNumber },
    })
  );
}

/**
 * Closes the tab with the specified tab number.
 * @param {number} tabNumber - Tab number to close.
 */
 function closeTab(tabNumber) {
  const frames = document.querySelectorAll("iframe");
  [...frames].forEach((frame) => {
    if (frame.id === `frame-${tabNumber}`) {
      frame.remove();
    }
  });

  if (currentTab === tabNumber) {
    const otherFrames = document.querySelectorAll('iframe[id^="frame-"]');
    if (otherFrames.length > 0) {
      switchTab(parseInt(otherFrames[0].id.replace("frame-", "")));
    } else {
      newTab();
    }
  }

  document.dispatchEvent(
    new CustomEvent("close-tab", {
      detail: { tabNumber },
    })
  );
}

 function getOriginalUrl(url) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("/scramjet/") && url.includes(location.origin)) {
      try {
        const urlObj = new URL(url);
        if (urlObj.pathname.startsWith("/scramjet/")) {
          const encodedUrl = urlObj.pathname.substring("/scramjet/".length);
          try {
            const decoded = decodeURIComponent(encodedUrl);
            if (decoded.startsWith("http")) {
              return decoded;
            }
            const base64Decoded = atob(encodedUrl);
            if (base64Decoded.startsWith("http")) {
              return base64Decoded;
            }
          } catch (e) {}
        }
      } catch (e) {}
    } else {
      iframe.src.split(__uv$config.prefix)[1];
    }
    return url;
  }
}
import("/glass/glassJS.config.js");
console.log("search.js loaded");
let iframe;
let transportx;
let activeWisp;
const bar = document.getElementById("bar");
let progress = 0;

if (localStorage.getItem("transportType") == null) {
	localStorage.setItem("transportType", "libcurl");
	transportx = "libcurl";
} else {
	transportx = localStorage.getItem("transportType");
}
setTransport(transportx);
console.log(transportx);

async function connectWisp() {
	const protocol = location.protocol === "https:" ? "wss://" : "ws://";
	const host = location.host;
	const fallbackAddr = `${protocol}${host}/wisp/`;
	const primaryAddr = fallbackAddr;

	const checkWisp = (url, timeout = 100) => {
		return new Promise((resolve) => {
			try {
				const socket = new WebSocket(url);
				const timer = setTimeout(() => {
					socket.close();
					resolve(false);
				}, timeout);

				socket.onopen = () => {
					clearTimeout(timer);
					socket.close();
					resolve(true);
				};

				socket.onerror = () => {
					clearTimeout(timer);
					resolve(false);
				};
			} catch (e) {
				resolve(false);
			}
		});
	};
	const checkkk = await checkWisp(primaryAddr);
	if (checkkk) {
		console.log(
			`%c connected using primary: (${primaryAddr})`,
			"color: #00ff00; font-weight: bold;",
		);
		setWisp(primaryAddr);
	} else {
		console.warn(
			`%c connected using fallback: (${fallbackAddr})`,
			"color: #ff9900; font-weight: bold;",
		);
		setWisp(fallbackAddr);
	}
}
function updatewisp() {
	activeWisp = localStorage.getItem("wisp");
	console.log("Checking WISP");
	if (activeWisp == null || activeWisp == "default") {
		connectWisp();
	} else {
		console.log(
			`%c connected using custom: (${activeWisp})`,
			"color: #00ff00; font-weight: bold;",
		);

		setWisp(activeWisp);
	}
}
updatewisp();
const uvList = ["https://discord.com"];
document.addEventListener("keyup", async (e) => {
	if (e.key === "Enter" || e.keyCode === 13) {
		setTimeout(() => (bar.style.width = "0%"), 300);
		progress = 0;

		let tabNumber = activeTabId.replace("tab", "");
		iframe = document.getElementById("frame" + tabNumber);
		if (
			input.value.trim().includes("https://") &&
			!input.value.trim().includes(".")
		) {
			input.value = localStorage
				.getItem("searchEngine")
				.replace("%s", input.value);
		} else if (
			input.value.trim().includes(".") &&
			!input.value.trim().startsWith("http://") &&
			!input.value.trim().startsWith("https://")
		) {
			input.value = "https://" + input.value;
		}
		let loadingNotice = document.createElement("div");
		function loadingShow(text) {
			loadingNotice.className = "notice";
			loadingNotice.style.animation = "noticeShow 0.4s forwards";
			loadingNotice.textContent = text;
			document.body.appendChild(loadingNotice);
			console.log("Final URL:", input.value);
		}
		function loadingHide() {
			loadingNotice.textContent = "Done!";
			loadingNotice.style.animation = "noticeHide 0.4s ease 0.3s forwards";
		}

		loadingNotice.addEventListener("click", function() {
			loadingNotice.style.animation = "noticeHide 0.4s forwards";
		});
		let url = input.value;
		let proxyType = localStorage.getItem("proxyType"); //Checks if link includes geforce
		if (url.includes("nvidia") || url.includes("geforce")) {
			let geforceNotice = document.createElement("div");
			geforceNotice.className = "notice";
			geforceNotice.style.animation = "noticeShow 0.4s forwards";
			geforceNotice.textContent =
				"Open GeForce in dock bar for it to work (click to close)";
			document.body.appendChild(geforceNotice);
			console.log("Final URL:", input.value);
			console.log("nvidia");
			geforceNotice.addEventListener("click", function() {
				console.log("CLOSING");
				geforceNotice.style.animation = "noticeHide 0.4s forwards";
			});
		}




		else if (url.includes("porn") || url.includes("hentai") || url.includes("xvideos") || url.includes("xnxx")) {
			let geforceNotice = document.createElement("div");
			alert("STOP GOONING WE'RE WATCHING")
			geforceNotice.className = "notice";
			geforceNotice.style.animation = "noticeShow 0.4s forwards";
			geforceNotice.textContent =
				"stop gooning we are watching you";
			document.body.appendChild(geforceNotice);
			console.log("Final URL:", input.value);
			console.log("nvidia");
			geforceNotice.addEventListener("click", function() {
				console.log("CLOSING");
				geforceNotice.style.animation = "noticeHide 0.4s forwards";
			});
		}




		else if (proxyType == null || proxyType == "Auto") {
			proxyType = "Auto";
			const match = uvList.findIndex((base) => input.value.startsWith(base)); // Checks if link includes discord
			if (match == -1) {
				console.log("loading SJ");
				url = await proxySJ(makeURL(input.value));
				loadingShow("Loading...");
			} else {
				console.log("loading UV");
				url = await proxyUV(makeURL(input.value));
				loadingShow("Loading...");
			}
		} else if (proxyType === "SJ") {
			// Regular
			url = await proxySJ(makeURL(input.value));
			loadingShow("Loading...");
			console.log("set to SJ");
		} else if (proxyType === "UV") {
			url = await proxyUV(makeURL(input.value));
			loadingShow("Loading...");
			console.log("set to UV");
		}
		iframe.src = url;
		if (proxyType === "SJ") {
			updateIframeTitle();
		} else if (proxyType === "UV") {
			updateIframeTitle();
		} else {
			updateIframeTitle();
		}
		if (proxyType === "SJ") {
			input.value = getOriginalUrl(iframe.src);
		} else if (proxyType === "UV") {
			updateIframeTitle();
			input.value = __uv$config.decodeUrl(
				iframe.src.split(__uv$config.prefix)[1],
			);
		} else {
			input.value = getOriginalUrl(iframe.src);
		}

		console.log("Loading URL in", iframe.id, ":", url);
		let currentTab = document.getElementById("tab" + tabNumber);
		let tabName = currentTab?.querySelector(".tabName");
		function updateIframeTitle() {
			iframe = document.getElementById(
				"frame" + activeTabId.replace("tab", ""),
			);
			console.log("Updating title for iframe:", iframe.id);
			iframe.onload = () => {
				loadingHide();
				try {
					tabName.textContent =
						iframe.contentDocument?.title + " (" + proxyType + ")" ||
						"Untitled";
				} catch {
					tabName.textContent = "Cross-origin page";
				}
			};
			const fakeLoad = setInterval(() => {
				if (progress < 90) {
					progress += Math.random() * 8;
					bar.style.width = progress + "%";
				}
			}, 200);

			iframe.addEventListener("load", () => {
				clearInterval(fakeLoad);
				bar.style.width = "100%";
				setTimeout(() => (bar.style.width = "0%"), 300);
				progress = 0;
			});
		}
	}
});

function bugReports() {
	newTab();
	let tabNumber = activeTabId.replace("tab", "");
	iframe = document.getElementById("frame" + tabNumber);
	iframe.src = "/report.html";
}
window.bugReports = bugReports;
window.updatewisp = updatewisp;


