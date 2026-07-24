export function getMessageColor(message) {
  if (message.startsWith('✓')) return 'var(--success)';
  if (message.startsWith('⚠')) return 'var(--danger)';
  return 'var(--accent)';
}
