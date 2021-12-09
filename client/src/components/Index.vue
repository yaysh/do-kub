<template>
    <div>
        <div>
            <h1>Add new message</h1>
            <input v-model="new_message" placeholder="Add new message" />
            <p />
            <button @click="addMessage">Add new message</button>
        </div>
        <h1>Messages</h1>
        <div v-for="message in messages" :key="message.message_id">
            {{ message.message_id }}: {{ message.message }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Message } from "@/models/message";

export default defineComponent({
    data() {
        return {
            messages: [] as Message[],
            new_message: "",
        };
    },
    mounted() {
        this.getMessages();
    },
    methods: {
        async getMessages() {
            let headers = new Headers();
            headers.set("Content-Type", "application/json");
            await fetch(process.env.VUE_APP_API_URL + "/messages", {
                method: "GET",
                headers: headers,
            })
                .then((x) => x.json())
                .then((x: Message[]) => (this.messages = x));
        },
        async addMessage() {
            if (this.new_message.length < 250 && this.new_message.length > 0) {
                let headers = new Headers();
                headers.set("Content-Type", "application/json");
                await fetch(process.env.VUE_APP_API_URL + "/messages", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({ message: this.new_message }),
                })
                    .then((x) => {
                        if (x.status == 201) return x.json();
                    })
                    .then((x: Message) => {
                        if (x.message && x.message_id && x.message_id > 0)
                            this.messages.push(x);
                    });
            }
        },
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
