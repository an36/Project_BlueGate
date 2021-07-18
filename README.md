# [Project BlueGate (*an Online Web-Bluetooth Terminal*)](https://bluegate.herokuapp.com/)
***Project BlueGate** is an online Web-Bluetooth Terminal that allows users to connect and communicate with other devices via BLE (Low Energy Bluetooth)*

<div align="center">
<a href="https://bluegate.herokuapp.com/" target="_blank">
<img src="https://res.cloudinary.com/dhud5kifu/image/upload/v1626646970/demos/PBG_example_snippet_pn3kkj.png" width="720" height="360" alt="PBG snippet">
</a>
</div>

<div align="center">
<sup>Visit Project BlueGate by clicking on the image above or the header title</sup>
</div>

---

## Features & Specification
- [x] Allows Bluetooth connection to up to 5 devices per browser's page/tab.
- [x] Allows READs and WRITEs only from/to devices that have READ, WRITE, & NOTIFY properties enabled.
- [x] Allows users to add custom (or standard) UUID Bluetooth Services to be able to READ & WRITE from/to specific devices with specific Bluetooth Services.
- [x] Stores the added Bluetooth Service & UUIDs, under browsers local storage, to be loaded once the user revisits the page; to save time and effort.
- [x] Allows users to use the Terminal to either send ASCII values to all connected devices at once (by using the 'All' Terminal) or to send ASCII values to individual devices.  (If the connected device allows READ, WRITE, & NOTIFY then you shall see a new terminal tab for that device where you can send values to it individually).
- [x] Allows users to clear individual terminals and to change the background & log colors of all terminals.
- [x] Allows users to use customizable Shortcut Buttons where the user can cutomize the label & value of a Shortcut Button and use to send that value to the desired device(s).

---

## Help & How To:
### I. How to Connect & Disconnect
1. Make sure that both of your Bluetooth and the desired device's Bluetooth is ON.
2. Add the desired device's UUID in *'Bluetooth Services'* input field (located at top-left corner).
3. Click the *'Connect'* button to Scan and Connect the desired device.  After a successful connection, you'll see the name of the device on the left column.
4. To diconnect a device, simply click the <img src="/src/public/assets/discon.png" width="18" height="18" alt="Clear"> icon next to that device name.

***NOTE:** Project BlueGate Terminal will allow you to connect to up to 5 devices per browser tab/page.*

#

### II. How to use the Terminal
- If the connected device allows READs, WRITEs, & NOTIFYs, then you shall see a new Terminal tab (next to 'All' tab) where you can communicate with that device.
- You can simply send a value (formated as ASCII), to 'All' device or individual ones, by typing it into the terminal's input field and clicking 'Send' or pressing 'Enter' key.
- You can also clear a terminal by clicking  <img src="/src/public/assets/trash.png" width="18" height="18" alt="Clear">  and/or change the Terminals colors by clicking  <img src="/src/public/assets/settings.jpg" width="18" height="18" alt="Clear">.

***NOTE:** The 'All' Terminal will print the values read from all connected devices.  The 'All' Terminal also sends ASCII values to all connected devices, when the user sends a value using the 'All' Terminal.  To send values to individual devices, simply open that device's terminal by clicking its tab and send values from there.*

#

### III. How to use Shortcut Buttons
*The Shortcuts can be used to send a specific value by clicking a Shortcut Button instead of typing that value over and over into the Terminal.*
1. You can assign a value to Shortcuts by clicking <img src="/src/public/assets/settings.jpg" width="18" height="18" alt="Clear">.
2. Clicking <img src="/src/public/assets/settings.jpg" width="18" height="18" alt="Clear"> will display the settings where you can specify the name (label) and value of each Shortcut.
3. After that, you can either press the 'Enter' key or click <img src="/src/public/assets/check.png" width="18" height="18" alt="Clear"> to confirm the desired settings.
4. Finally, you can send the specified value of a Shortcut by clicking that Shortcut's Button.
5. You can also clear and restore the default Shortcuts' settings by clicking <img src="/src/public/assets/trash.png" width="18" height="18" alt="Clear">.

***NOTE:** A Shortcut, when clicked, will send its specified value to the open terminal's device.  I.e., if the 'All' terminal is open, then a Shortcut, when clicked, will send its value to all connected devices.  In simpler terms, Shortcuts send their value to the specified (or opened) terminal.*

#

### IV. General Notes
1. The UUIDs added by the user, in **'Bluetooth Services'**, will get stored locally.  Meaning, the added UUIDs will get loaded once the user revisits the page; to save time and effort.
2. If an added UUID is causing an error, then that UUID can be removed from the *'Bluetooth Services'* by selecting (or typing) that UUID and clicking 'Remove' or pressing the 'Enter' key.
3. The *'Add'* button changes to *'Remove'* when an added UUID is selected or typed into *'Bluetooth Services'*.
