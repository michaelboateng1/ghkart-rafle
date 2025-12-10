// export function getSectionAtTop(rotation, sections) {
// 	const anglePerSection = (2 * Math.PI) / sections;
// 	// Normalize rotation to 0-2PI range
// 	let normalizedRotation = rotation % (2 * Math.PI);
// 	if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;

// 	// The top is at 3π/2 (270 degrees, pointing up)
// 	// We need to find which section is centered at this position
// 	const angleAtTop = ((3 * Math.PI) / 2 - normalizedRotation) % (2 * Math.PI);
// 	// const adjustedAngle = (topAngle - normalizedRotation + anglePerSection / 2) % (2 * Math.PI);
// 	// let sectionIndex = Math.floor(adjustedAngle / anglePerSection);
// 	let sectionIndex = Math.floor(angleAtTop / anglePerSection) % sections;

// 	if (sectionIndex < 0) sectionIndex += sections;

// 	// console.log({
// 	//     normalizedRotation: (normalizedRotation * 180 / Math.PI).toFixed(2) + '°',
// 	//     angleAtTop: (angleAtTop * 180 / Math.PI).toFixed(2) + '°',
// 	//     sectionIndex: sectionIndex,
// 	//     label: ['Laptop', 'Try Again', 'Mobile Phone', 'Try Again', 'Battery', 'Try Again', 'RAM', 'Try Again'][sectionIndex]
// 	// });

// 	return sectionIndex;
// }
