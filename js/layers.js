addLayer("c", {
    name: "corruption", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Corruption Points", // Name of prestige currency
    baseResource: "Shadow Energy Units", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('c', 21)) mult = mult.times(upgradeEffect('c', 21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for Corruption Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
	upgrades: {
		11: {
			title: "Start Corruption",
			description: "Start generating Shadow Energy Units (SEU).",
			cost: new Decimal(1),
        },
		12: {
			title: "Speed Up Corruption",
			description: "Increase SEU gain speed by 3x.",
			cost: new Decimal(1),
			unlocked() { return (hasUpgrade(this.layer, 11))},
		},
		13: {
			title: "Self-Sustaining Corruption",
			description: "SEU gain multiplied by SEU units obtained.",
			effect() {
				let effect = player.points.add(1).pow(0.15)
				if (hasUpgrade(this.layer, 22)) effect = player.points.add(1).pow(0.25)
				return effect
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			cost: new Decimal(3),
			unlocked() { return (hasUpgrade(this.layer, 12))},
		},
		14: {
			title: "Corruption Boost",
			description: "SEU gain multiplied by current Corruption Points (CP).",
			effect() {
				let effect = player[this.layer].points.add(1).pow(0.5)
				if (hasUpgrade(this.layer, 23)) effect = player[this.layer].points.add(1).pow(0.75)
				return effect
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			cost: new Decimal(3),
			unlocked() { return (hasUpgrade(this.layer, 12))},
		},
		21: {
			title: "Shadow Experiments",
			description: "CP gain multiplied by current SEU units obtained.",
			effect() {
				return player.points.add(99).dividedBy(100).pow(0.15)
			},
			effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
			cost: new Decimal(5),
			unlocked() { return ((hasUpgrade(this.layer, 13)) && (hasUpgrade(this.layer, 14)))},
		},
		22: {
			title: "Advanced Self-Sustaining Corruption",
			description: "Improves the Self-Sustaining Corruption exponent from ^0.15 to ^0.25",
			cost: new Decimal(10),
			unlocked() { return (hasUpgrade(this.layer, 21))},
		},
		23: {
			title: "Advanced Corruption Boost",
			description: "Improves the Corruption Boost exponent from ^0.5 to ^0.75.",
			cost: new Decimal(10),
			unlocked() { return (hasUpgrade(this.layer, 21))},
		},
		24: {
			title: "Shadow Energy Injection",
			description: "Gain 1% of potential Corruption Points per second.",
			cost: new Decimal(20),
			unlocked() { return ((hasUpgrade(this.layer, 22)) && (hasUpgrade(this.layer, 23)))},
		},
    },
	passiveGeneration(){
		let gen = 0
		if (hasUpgrade(this.layer, 24)) gen = 0.01
		return gen
	},
})
