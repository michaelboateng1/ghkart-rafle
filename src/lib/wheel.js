export function drawWheel(canvasWidth, canvasHeight, ctx, sections, rotation, colors, labels) {
	const centerX = canvasWidth / 2;
	const centerY = canvasHeight / 2;
	const radius = Math.min(centerX, centerY) - 20;
	const anglePerSection = (2 * Math.PI) / sections;

	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(rotation);

	ctx.beginPath();
	ctx.arc(0, 0, radius + 20, 0, Math.PI * 2);
	ctx.fillStyle = '#0f3460';
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = '#e94560';
	ctx.stroke();

	// Draw sections
	for (let i = 0; i < sections; i++) {
		const startAngle = i * anglePerSection;
		const endAngle = startAngle + anglePerSection;

		// Draw section
		ctx.beginPath();
		ctx.arc(0, 0, radius, startAngle, endAngle);
		ctx.lineTo(0, 0);
		ctx.fillStyle = colors[i];
		ctx.fill();
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 3;
		ctx.stroke();

		// Draw text
		ctx.save();
		ctx.rotate(startAngle + anglePerSection / 2);
		ctx.textAlign = 'center';
		ctx.fillStyle = '#000';
		ctx.font = 'bold 17px Arial';
		ctx.fillText(labels[i], radius * 0.65, 0);
		ctx.restore();
	}

	// Draw center circle
	ctx.beginPath();
	ctx.arc(0, 0, 25, 0, 2 * Math.PI);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.strokeStyle = '#333';
	ctx.lineWidth = 3;
	ctx.stroke();

	// Draw center decorative circle
	ctx.beginPath();
	ctx.arc(0, 0, 40 / 2, 0, Math.PI * 2);
	ctx.fillStyle = '#e94560';
	ctx.fill();

	ctx.beginPath();
	ctx.arc(0, 0, 8, 0, Math.PI * 2);
	ctx.fillStyle = '#0f3460';
	ctx.fill();

	ctx.restore();
}

function getSectionAtTop(rotation, sections) {
	const anglePerSection = (2 * Math.PI) / sections;
	// Normalize rotation to 0-2PI range
	let normalizedRotation = rotation % (2 * Math.PI);
	if (normalizedRotation < 0) normalizedRotation += 2 * Math.PI;

	// The top is at 3π/2 (270 degrees, pointing up)
	// We need to find which section is centered at this position
	const angleAtTop = ((3 * Math.PI) / 2 - normalizedRotation) % (2 * Math.PI);
	// const adjustedAngle = (topAngle - normalizedRotation + anglePerSection / 2) % (2 * Math.PI);
	// let sectionIndex = Math.floor(adjustedAngle / anglePerSection);
	let sectionIndex = Math.floor(angleAtTop / anglePerSection) % sections;

	if (sectionIndex < 0) sectionIndex += sections;

	// console.log({
	//     normalizedRotation: (normalizedRotation * 180 / Math.PI).toFixed(2) + '°',
	//     angleAtTop: (angleAtTop * 180 / Math.PI).toFixed(2) + '°',
	//     sectionIndex: sectionIndex,
	//     label: ['Laptop', 'Try Again', 'Mobile Phone', 'Try Again', 'Battery', 'Try Again', 'RAM', 'Try Again'][sectionIndex]
	// });

	return sectionIndex;
}

export function updateSelectorColor(selector, colors, rotation, sections) {
	const sectionIndex = getSectionAtTop(rotation, sections);
	selector.style.borderTopColor = colors[sectionIndex];
}

export function spin({
	rotation,
	spinning,
	resultDiv,
	spinBtn,
	animationId,
	sections,
	colors,
	labels,
	canvasWidth,
	canvasHeight,
	ctx,
	selector,
	onUpdate
}) {
	if (spinning) return;

	onUpdate({ spinning: true });
	spinBtn.disabled = true;

	// Determine outcome first based on probability
	const prizeChance = Math.random();
	let targetLabel;

	console.log('Prize chance:', prizeChance);

	if (prizeChance < 0.02) {
		targetLabel = 'Laptop';
	} else if (prizeChance < 0.05) {
		targetLabel = 'Phone Watch';
	} else if (prizeChance < 0.08) {
		targetLabel = 'Battery';
	} else if (prizeChance < 0.12) {
		targetLabel = 'Keyboard';
	} else {
		// TODO:Chnage this back to "Try Again";
		targetLabel = 'Laptop';
	}

	console.log('Target label:', targetLabel);

	// Find ALL sections with that label
	const matchingIndices = [];
	labels.forEach((label, index) => {
		if (label === targetLabel) {
			matchingIndices.push(index);
		}
	});

	console.log('Matching indices:', matchingIndices);

	// Pick a random section from the matching ones
	const targetIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
	console.log('Selected target index:', targetIndex);

	const anglePerSection = (2 * Math.PI) / sections;

	// Calculate the angle range for the target section
	const minAngleAtTop = targetIndex * anglePerSection;
	const maxAngleAtTop = (targetIndex + 1) * anglePerSection;

	// Pick a random angle within this range (with margin to avoid edges)
	const margin = anglePerSection * 0.1;
	const angleAtTop = minAngleAtTop + margin + Math.random() * (anglePerSection - 2 * margin);

	// Solve for the ABSOLUTE rotation value needed
	const selectorAngle = (3 * Math.PI) / 2;
	let absoluteRotation = selectorAngle - angleAtTop;

	// Normalize to 0-2π range
	while (absoluteRotation < 0) {
		absoluteRotation += 2 * Math.PI;
	}
	while (absoluteRotation >= 2 * Math.PI) {
		absoluteRotation -= 2 * Math.PI;
	}

	// Calculate how much MORE we need to rotate from current position
	const currentNormalized = rotation % (2 * Math.PI);
	let additionalRotation = absoluteRotation - currentNormalized;

	// Make sure we rotate forward (at least one full rotation)
	while (additionalRotation < 2 * Math.PI) {
		additionalRotation += 2 * Math.PI;
	}

	// Add extra full spins for visual effect (these don't change the outcome)
	const extraSpins = Math.floor(4 + Math.random() * 3); // 4-6 extra spins
	const targetRotation = rotation + additionalRotation + extraSpins * 2 * Math.PI;

	// console.log('Current rotation:', rotation);
	// console.log('Current normalized:', currentNormalized);
	// console.log('Target absolute rotation:', absoluteRotation);
	// console.log('Additional rotation (with min 1 spin):', additionalRotation);
	// console.log('Extra spins:', extraSpins);
	// console.log('Final target rotation:', targetRotation);
	// console.log('Expected final normalized:', targetRotation % (2 * Math.PI));
	// console.log('angleAtTop:', angleAtTop);

	const duration = 5000;
	const startTime = Date.now();
	const startRotation = rotation;

	function animate() {
		const currentTime = Date.now();
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);

		// Easing function (ease out cubic)
		const easeProgress = 1 - Math.pow(1 - progress, 3);

		const newRotation = startRotation + (targetRotation - startRotation) * easeProgress;
		onUpdate({ rotation: newRotation });

		drawWheel(canvasWidth, canvasHeight, ctx, sections, newRotation, colors, labels);
		updateSelectorColor(selector, colors, newRotation, sections);

		if (progress < 1) {
			animationId = requestAnimationFrame(animate);
		} else {
			onUpdate({ spinning: false });
			// spinning = false;
			spinBtn.disabled = false;

			const selectedSection = getSectionAtTop(newRotation, sections);

			if (labels[selectedSection] === 'Try Again') {
				onUpdate({ result: `😭 Please ${labels[selectedSection]}! 😭`, selectedSection });
				return;
			}

			onUpdate({ result: `😱🥳 You Won A ${labels[selectedSection]}! 🎊🎉`, selectedSection });
		}
	}

	// function animate() {
	// 	const currentTime = Date.now();
	// 	const elapsed = currentTime - startTime;
	// 	const progress = Math.min(elapsed / duration, 1);

	// 	const easeProgress = 1 - Math.pow(1 - progress, 3);
	// 	const newRotation = startRotation + (targetRotation - startRotation) * easeProgress;

	// 	onUpdate({ rotation: newRotation });

	// 	drawWheel(canvasWidth, canvasHeight, ctx, sections, newRotation, colors, labels);
	// 	updateSelectorColor(selector, colors, newRotation, sections);

	// 	if (progress < 1) {
	// 		requestAnimationFrame(animate);
	// 	} else {
	// 		onUpdate({ spinning: false });
	// 		spinBtn.disabled = false;

	// 		const winningSection = getSectionAtTop(newRotation, sections);

	// 		// ADD THIS DETAILED LOGGING:
	// 		const finalNormalized = newRotation % (2 * Math.PI);
	// 		const finalAngleAtTop = ((3 * Math.PI) / 2 - finalNormalized) % (2 * Math.PI);
	// 		console.log('=== FINAL RESULT ===');
	// 		console.log('Expected index:', targetIndex);
	// 		console.log('Actual winning index:', winningSection);
	// 		console.log('Final rotation:', newRotation);
	// 		console.log('Final normalized rotation:', finalNormalized);
	// 		console.log('Final angleAtTop:', finalAngleAtTop);
	// 		console.log('Calculated section:', Math.floor(finalAngleAtTop / anglePerSection));
	// 		console.log('==================');

	// 		onUpdate({ result: `🎉 You won: ${labels[winningSection]}! 🎉` });
	// 	}
	// }

	animate();
}

// spinBtn.addEventListener('click', spin);

// // Initial draw
// drawWheel();
// updateSelectorColor();
