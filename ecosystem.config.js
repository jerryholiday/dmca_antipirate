module.exports = {
  apps: [{
    name: 'antipirate',
    script: './src/index.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }],
}