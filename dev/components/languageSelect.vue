<template>
  <div>
    <p>
      <translate>Select your language:</translate>
    </p>
    <p>
      <select name="language" v-model="$currentLanguage">
        <option v-for="(language, key) in $availableLanguages" :value="key" :key="key">{{ language }}</option>
      </select>
    </p>
  </div>
</template>
