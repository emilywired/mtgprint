<script setup lang="ts">
import { ref } from "vue";
import {
  fetchArchidektDeckData,
  fetchMoxfieldDeckData,
  fetchScryfall,
} from "./stuff/api";
import { parseDecklist } from "./stuff/parser";

async function handleFetchDecklist(url: string) {
  const parsedUrl = URL.parse(url);
  if (parsedUrl == null) {
    errorMessage.value = "Invalid url";
    return;
  }

  switch (parsedUrl.hostname) {
    case "moxfield.com": {
      const deckId = parsedUrl.pathname.split("/").at(-1)!;
      return fetchMoxfieldDeckData(deckId);
    }

    case "archidekt.com": {
      const parts = parsedUrl.pathname.split("/");
      const index = parts.findIndex((s) => s == "decks") + 1;
      const deckId = parts.at(index)!;
      return fetchArchidektDeckData(deckId);
    }

    default:
      errorMessage.value = `${parsedUrl} is not supported`;
  }
}

function handleSubmitDecklist(decklist: string) {
  const cards = parseDecklist(decklist);
  fetchScryfall(cards);
}

const errorMessage = ref("");
const urlInput = ref("https://archidekt.com/api/decks/26061450/");
const decklist = ref("");
</script>

<template>
  <main>
    <input type="text" placeholder="Moxfield url" v-model="urlInput" />
    <p v-if="errorMessage">Error</p>
    <button @click="handleFetchDecklist(urlInput)">Fetch Decklist</button>

    <textarea name="decklist" v-model="decklist"></textarea>

    <button @click="handleSubmitDecklist(decklist)">Submit</button>
  </main>
</template>
