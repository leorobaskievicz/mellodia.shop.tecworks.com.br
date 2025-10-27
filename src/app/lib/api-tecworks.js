class Api {
  constructor(token = "YWRtOmxlb0AxOTkz") {
    this.url = "https://api.tecworks.com.br";
    this.token = token;
  }

  async request(url, method = "GET", body = null) {
    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${this.token}`,
      };

      const options = { method, headers };
      if (body) {
        options.body = JSON.stringify({
          ...body,
        });
      }

      // await new Promise((resolve) => setTimeout(resolve, 1000 * 4));

      const response = await fetch(`${this.url}${url}`, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.msg || "Erro na resposta da API");
      }

      return data;
    } catch (error) {
      console.error("Erro na API:", error.message);
      return {
        status: false,
        msg: error.message,
      };
    }
  }

  async get(url) {
    return this.request(url, "GET");
  }

  async post(url, body = null) {
    return this.request(url, "POST", body);
  }

  async put(url, body = null) {
    return this.request(url, "PUT", body);
  }

  async delete(url) {
    return this.request(url, "DELETE");
  }
}

export default Api;
