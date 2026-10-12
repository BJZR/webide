export function downloadBackup(snapshot) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }));
  link.download = `backup-${snapshot.at.replace(/[:.]/g, '-')}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
