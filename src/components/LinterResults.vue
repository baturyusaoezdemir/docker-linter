<template>
	<div class="lint-results">
		<h2>Linting Results</h2>
		<div v-if="results.length">
			<div v-for="(severityGroup, severity) in groupedResults" :key="severity" class="result-group">
				<h3 :class="severityClass(severity)">
					<i :class="severityIcon(severity)"></i> {{ severity }} Issues
				</h3>
				<ul>
					<li v-for="(result, index) in severityGroup" :key="index">
						<span class="line-number">Line {{ result.line }}</span>: 
						<span class="message">{{ result.message }}</span>
						<div class="tooltip">
							<i class="info-icon">ℹ️</i>
							<span class="tooltip-text">{{ result.explanation }}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<p v-else>No issues found! 🎉</p>
	</div>
</template>

<script>
export default {
	props: {
		results: {
			type: Array,
			required: true,
		},
	},
	computed: {
		groupedResults() {
			const severityOrder = ["Critical", "High", "Medium", "Low"];
			const grouped = this.results.reduce((acc, result) => {
				acc[result.severity] = acc[result.severity] || [];
				acc[result.severity].push(result);
				return acc;
			}, {});

			return Object.fromEntries(
				severityOrder
					.map((severity) => [severity, grouped[severity] || []])
					.filter(([_, group]) => group.length > 0)
			);
		},
	},
	methods: {
		severityClass(severity) {
			return {
				Critical: "critical",
				High: "high",
				Medium: "medium",
				Low: "low",
			}[severity];
		},
		severityIcon(severity) {
			return {
				Critical: "fas fa-exclamation-circle",
				High: "fas fa-exclamation-triangle",
				Medium: "fas fa-info-circle",
				Low: "fas fa-check-circle",
			}[severity];
		},
	},
};
</script>

<style>
.lint-results {
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.result-group h3 {
	margin-top: 10px;
	margin-bottom: 5px;
}

.result-group h3.critical {
	color: #dc3545;
}

.result-group h3.high {
	color: #ffc107;
}

.result-group h3.medium {
	color: #17a2b8;
}

.result-group h3.low {
	color: #28a745;
}

ul {
	list-style: none;
	padding: 0;
}

li {
	margin: 5px 0;
	display: flex;
	align-items: center;
}

.line-number {
	font-weight: bold;
	margin-right: 5px;
}

.tooltip {
	margin-left: 10px;
	position: relative;
}

.tooltip .info-icon {
	font-size: 0.9rem;
	cursor: pointer;
}

.tooltip .tooltip-text {
	visibility: hidden;
	background-color: #333;
	color: #fff;
	text-align: center;
	padding: 5px;
	border-radius: 5px;
	position: absolute;
	z-index: 1;
	bottom: 125%;
	left: 50%;
	transform: translateX(-50%);
	white-space: nowrap;
}

.tooltip:hover .tooltip-text {
	visibility: visible;
}
</style>
