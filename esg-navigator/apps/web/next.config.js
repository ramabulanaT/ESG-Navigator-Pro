module.exports = {
  typescript: {
    // Catch type errors during build
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    // Enable ESLint during builds to enforce code quality
    dirs: ['app'],
  },
}
