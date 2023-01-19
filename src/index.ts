export interface Env {
    ACCESS_TOKEN: string;
    INSTANCE_URL: string;
}

interface Comic {
    num: number;
    alt: string;
    img: string;
    safe_title: string;
}

interface Image {
    id: number;
}

export default {
    async scheduled(
        controller: ScheduledController,
        env: Env,
        ctx: ExecutionContext
    ): Promise<void> {
        const response = await fetch("https://xkcd.com/info.0.json");
        const json = await response.json<Comic>();

        const number = Math.floor(Math.random() * (json.num + 1));

        const comic = await fetch(`https://xkcd.com/${number}/info.0.json`);
        const comic_json = await comic.json<Comic>();

        const blob = await getImageBlob(comic_json.img);

        const image = await createImage(env, blob, comic_json.alt);
        const image_json = await image.json<Image>();

        const status = `(xkcd #${number}) ${comic_json.safe_title}
https://xkcd.com/${number}`;

        const post = await createPost(env, status, image_json.id);
    },
};

async function getImageBlob(url: string): Promise<Blob> {
    const image = await fetch(url);

    return image.blob();
}

async function request(
    env: Env,
    route: string,
    method: string,
    body: FormData | null
): Promise<Response> {
    const payload = {
        body,
        method,
        headers: {
            Authorization: `Bearer ${env.ACCESS_TOKEN}`,
        },
    };

    const url = `${env.INSTANCE_URL}/${route}`;

    return fetch(url, payload);
}

async function createPost(
    env: Env,
    status: string,
    media_id: number
): Promise<Response> {
    let formData = new FormData();
    formData.append("status", status);
    formData.append("media_ids[]", media_id.toString());

    return await request(env, "/api/v1/statuses", "POST", formData);
}

async function createImage(
    env: Env,
    blob: Blob,
    description: string
): Promise<Response> {
    let formData = new FormData();
    formData.append("file", blob);
    formData.append("description", description);

    return await request(env, "/api/v2/media", "POST", formData);
}
