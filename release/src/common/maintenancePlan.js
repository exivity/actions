function isMaintenancePlan(plan, lockfile) {
  return plan?.mode === 'maintenance' && plan.version === lockfile.version
}
module.exports = { isMaintenancePlan }
