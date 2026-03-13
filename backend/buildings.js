let go_back = document.querySelector("#back-to-dashboard");
go_back.onclick = function (){
	window.location.href = "../../frontend/pages/dashboard.html";
};

let buildingRedirect = (buildingID, roomlink) => {
	let building = document.querySelector(buildingID);
	building.onclick = () => {
		// let parentName = document.getElementById(buildingID.slice(1)).parentClassName;
		// console.log(parentName);
		let buildingName = document.querySelector(buildingID + " .building-name").innerHTML
		let buidlingNameStorage = localStorage.setItem("bldg-name", buildingName);
		window.location.href = roomlink;
	}
}


buildingRedirect('#HenrySy-area', '/reserve-seat/henrysy');
buildingRedirect('#Gokongwei-area', '/reserve-seat/gokongwei');
buildingRedirect('#StLasalle-area', '/reserve-seat/stlasalle');

;

// let henryBuilding = document.querySelector("#HenrySy-area");
// henryBuilding.onclick = function () {
// 	window.location.href = "reserve-rooms.html";
// };
// let goksBuilding = document.querySelector("#Gokongwei-area");
// goksBuilding.onclick = function () {
// 	window.location.href = "reserve-rooms.html";
// };
// let stLasalleBuilding = document.querySelector("#StLasalle-area");
// stLasalleBuilding.onclick = function () {
// 	window.location.href = "reserve-rooms.html";
// };