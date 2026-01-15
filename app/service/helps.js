export function parseFilter(filter) {
  return String(filter)
    .trim()
    .split(/\s+/)
    .map((token) => {
      const match = token.match(/^(>=|<=|>|<|=)?(.+)$/)

      if (!match) return null

      let [, operator, value] = match

      if (value === 'true') value = true
      else if (value === 'false') value = false
      else if (!isNaN(value)) value = Number(value)

      return {
        operator: operator || 'contains',
        value,
      }
    })
    .filter(Boolean)
}

export function matchValue(fieldValue, { operator, value }) {
  if (fieldValue === null || fieldValue === undefined) return false

  // boolean
  if (typeof value === 'boolean') {
    return fieldValue === value
  }

  // number
  if (typeof value === 'number' && typeof fieldValue === 'number') {
    switch (operator) {
      case '>': return fieldValue > value
      case '<': return fieldValue < value
      case '>=': return fieldValue >= value
      case '<=': return fieldValue <= value
      case '=': return fieldValue === value
      default: return false
    }
  }

  // string (default)
  return String(fieldValue)
    .toLowerCase()
    .includes(String(value).toLowerCase())
}

function formatNumber(value) {
    // Valores realmente inválidos
    if (value === null || value === undefined || value === '') {
        return null;
    }

    // Agora converte
    const num = Number(value);

    // Se após a conversão continuar não sendo número, retorna null
    if (isNaN(num)) {
        return null;
    }

    // Se for inteiro
    if (Number.isInteger(num)) {
        return num;
    }

    // Limita para 2 casas
    return Number(num.toFixed(2));
}


function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatGB(value) {
  if (value === undefined || value === null) return '-';
  return `${Number(value).toFixed(2)} GB`;
}

function formatPercentage(value) {
  if (value === undefined || value === null) return 0;
  return Number(value).toFixed(1);
}

function formatUptime(minutes) {
  if (!minutes) return '-';
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.floor(minutes % 60);
  return `${days}d ${hours}h ${mins}m`;
}

function formatFrequency(mhz) {
  if (mhz === undefined || mhz === null || isNaN(Number(mhz))) return '-';

  const value = Number(mhz);

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} GHz`;
  }

  return `${value.toFixed(0)} MHz`;
}

export const formatters = {
  number: formatNumber,
  bytes: formatBytes,
  gb: formatGB,
  percentage: formatPercentage,
  uptime: formatUptime,
  frequency: formatFrequency,
}

function getProgressColor(percent) {
  if (percent < 60) return 'bg-emerald-500';
  if (percent < 85) return 'bg-orange-500';
  return 'bg-red-500';
}


export const progress = {
  getColor: getProgressColor,
}