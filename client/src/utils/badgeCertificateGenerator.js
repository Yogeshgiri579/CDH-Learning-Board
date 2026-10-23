/**
 * Generates and downloads a high-resolution 1200x630 LinkedIn achievement graphic for any badge.
 */
export function generateAndDownloadBadgeImage({
  badgeName = 'DevOps Pioneer',
  badgeDesc = 'Module Mastery & Engineering Excellence',
  badgeIcon = '🚀',
  studentName = 'DevOps Engineer',
  rank = null,
  points = null,
}) {
  const width = 1200;
  const height = 630;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Dark Tech Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090d13');
  bgGrad.addColorStop(0.5, '#0d1117');
  bgGrad.addColorStop(1, '#05111b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Tech Grid Pattern
  ctx.strokeStyle = '#21262d';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // 3. Glowing Ambient Accent
  const glow = ctx.createRadialGradient(width / 2, 220, 20, width / 2, 220, 280);
  glow.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  glow.addColorStop(0.6, 'rgba(35, 134, 54, 0.15)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 4. Outer Gold / Neon Double Border
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = '#238636';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // 5. Header Branding
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#58a6ff';
  ctx.textAlign = 'center';
  ctx.fillText('CLOUDDEVOPSHUB • 55 SESSIONS MULTICLOUD & AI CHALLENGE', width / 2, 75);

  // 6. Badge Icon / Embellished Badge Ring
  const iconY = 190;
  ctx.beginPath();
  ctx.arc(width / 2, iconY, 60, 0, Math.PI * 2);
  ctx.fillStyle = '#161b22';
  ctx.fill();
  ctx.strokeStyle = '#e3b341';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Draw Emoji / Icon
  ctx.font = '54px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeIcon, width / 2, iconY + 4);
  ctx.textBaseline = 'alphabetic';

  // 7. Badge Title
  ctx.font = '900 38px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(badgeName.toUpperCase(), width / 2, 305);

  // 8. Badge Description
  ctx.font = '500 20px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#8b949e';
  ctx.textAlign = 'center';
  ctx.fillText(badgeDesc, width / 2, 345);

  // 9. Awarded to Divider & Student Name
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 385);
  ctx.lineTo(width / 2 + 200, 385);
  ctx.stroke();

  ctx.font = 'bold 15px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#3fb950';
  ctx.textAlign = 'center';
  ctx.fillText('AWARDED TO', width / 2, 415);

  ctx.font = '800 32px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#f0f6fc';
  ctx.textAlign = 'center';
  ctx.fillText(studentName, width / 2, 455);

  // 10. Rank & Points Pill (if provided)
  let footerY = 510;
  if (rank || points) {
    const statsText = [
      rank ? `Rank #${rank}` : null,
      points ? `${points} Points Earned` : null,
      '55-Day Track',
    ].filter(Boolean).join(' • ');

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#e3b341';
    ctx.fillText(statsText, width / 2, footerY);
    footerY += 40;
  }

  // 11. Footer Verification Info
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#8b949e';
  ctx.textAlign = 'left';
  ctx.fillText(`Issued: ${dateStr}`, 60, height - 55);

  ctx.textAlign = 'right';
  ctx.fillText('Verified Certificate: cdh-challenge.verify', width - 60, height - 55);

  // 12. Trigger Instant Download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const safeName = badgeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const link = document.createElement('a');
    link.download = `CDH-Badge-${safeName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to export badge image:', err);
  }
}

/**
 * Creates an autofill LinkedIn share URL with structured caption.
 */
export function openLinkedInShare({
  title = '',
  caption = '',
  url = 'https://clouddevopshub.com',
}) {
  // 1. Copy formatted text to clipboard automatically
  try {
    navigator.clipboard.writeText(caption);
  } catch {}

  // 2. LinkedIn feed direct share URL (pre-fills the post text in modern LinkedIn)
  const linkedInShareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;

  window.open(linkedInShareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Pre-fills and opens LinkedIn share for a student's leaderboard ranking.
 */
export function shareRankingOnLinkedIn({
  studentName = 'DevOps Learner',
  rank = 1,
  points = 0,
  completedCount = 0,
  quizzesPassed = 0,
}) {
  const rankText = rank ? `Rank #${rank}` : 'Top Rank';
  const caption = `🎯 Thrilled to share that I have achieved ${rankText} with ${points} points on the CloudDevOpsHub 55-Day MultiCloud, DevOps & AI Challenge! 🚀\n\n` +
    `📊 My Engineering Progress:\n` +
    `✅ ${completedCount}/55 Hands-on Sessions completed\n` +
    `🧠 ${quizzesPassed} DevOps Quizzes passed\n` +
    `🏆 Standing: ${rankText} on the Live Global Leaderboard\n\n` +
    `Huge shoutout to the CloudDevOpsHub community for this hands-on engineering journey.\n\n` +
    `#DevOps #CloudComputing #AWS #Azure #Kubernetes #Docker #Terraform #CI_CD #CloudDevOpsHub #LearnWithCDH`;

  openLinkedInShare({
    title: `My Ranking on CloudDevOpsHub: ${rankText}`,
    caption,
  });
}

/**
 * Pre-fills and opens LinkedIn share for an earned badge.
 */
export function shareBadgeOnLinkedIn({
  badgeName = 'DevOps Pioneer',
  badgeIcon = '🚀',
  studentName = 'DevOps Learner',
}) {
  const caption = `🎖️ Proud to announce I just unlocked the "${badgeName}" Badge ${badgeIcon} on CloudDevOpsHub!\n\n` +
    `Sharpening practical skills across Infrastructure as Code, Container Orchestration, MultiCloud Architectures, and Automated CI/CD Pipelines.\n\n` +
    `Onward to the next milestone in the 55-Day Engineering Challenge! 🚀\n\n` +
    `#DevOps #CloudDevOpsHub #CloudEngineering #Kubernetes #Docker #AWS #DevOpsBadge #MilestoneUnlocked`;

  openLinkedInShare({
    title: `Unlocked "${badgeName}" Badge`,
    caption,
  });
}

/**
 * Renders and downloads the exact high-res Hexagon Shield Badge PNG.
 */
export function downloadHexagonBadgeImage({
  moduleNumber = '02',
  title = 'LINUX',
  subtitle = 'UBUNTU + GCP',
  brand = 'CloudDevOpsHub',
  gradient = { from: '#e53915', to: '#8e1b03' },
  studentName = 'DevOps Engineer',
}) {
  const width = 800;
  const height = 960;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  const drawHexagon = (offset = 0) => {
    ctx.beginPath();
    ctx.moveTo(width / 2, 32 + offset);
    ctx.lineTo(width - 32 - offset, 216 + offset * 0.5);
    ctx.lineTo(width - 32 - offset, height - 216 - offset * 0.5);
    ctx.lineTo(width / 2, height - 32 - offset);
    ctx.lineTo(32 + offset, height - 216 - offset * 0.5);
    ctx.lineTo(32 + offset, 216 + offset * 0.5);
    ctx.closePath();
  };

  // Outer drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  drawHexagon(0);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Outer White Crisp Border
  drawHexagon(0);
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Inner Gradient Shield Body
  drawHexagon(14);
  const bgGrad = ctx.createLinearGradient(0, 40, 0, height - 40);
  bgGrad.addColorStop(0, gradient.from);
  bgGrad.addColorStop(1, gradient.to);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Subtle Bevel Highlight
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.stroke();

  // Text 1: MODULE XX
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(`MODULE ${moduleNumber}`, width / 2, 140);

  // Underline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 90, 168);
  ctx.lineTo(width / 2 + 90, 168);
  ctx.stroke();

  // Text 2: TITLE
  ctx.font = '900 84px system-ui, -apple-system, sans-serif';
  ctx.fillText(title, width / 2, 390);

  // Text 3: SUBTITLE
  ctx.font = '700 38px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillText(subtitle, width / 2, 490);

  // Text 4: Brand
  ctx.font = '700 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(brand, width / 2, 650);

  // Star Rating Motif: • ★ •
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(width / 2 - 64, 736, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width / 2 + 64, 736, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '54px system-ui, sans-serif';
  ctx.fillText('★', width / 2, 752);

  // Download trigger
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const link = document.createElement('a');
    link.download = `CDH-Module-${moduleNumber}-${safeTitle}-Badge.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to export hexagon badge:', err);
  }
}

