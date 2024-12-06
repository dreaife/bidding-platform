import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import angulareslint from '@angular-eslint/eslint-plugin';
import angulareslintTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

export default [
  eslint.configs.recommended,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.spec.ts',
      '**/*.js'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angulareslint
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error'
    }
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@angular-eslint/template': angulareslintTemplate
    },
    rules: {
      // 避免冗余的条件表达式
      '@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 3 }]
    }
  },
]; 