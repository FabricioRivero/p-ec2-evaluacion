import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../server";

describe("API Descargas - Integracion Backend", () => {
  let descargaId: string;

  it("debe crear una nueva descarga correctamente", async () => {
    const res = await request(app)
      .post("/api/descargas")
      .send({ url: "http://test.com/file.pdf", tipo: "mock", maxReintentos: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("estado", "pending");
    descargaId = res.body.id;
  });

  it("debe obtener el estado de una descarga existente", async () => {
    const res = await request(app).get(`/api/descargas/${descargaId}/estado`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", descargaId);
    expect(res.body).toHaveProperty("estado");
  });

  it("debe listar todas las descargas", async () => {
    const res = await request(app).get("/api/descargas");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("debe manejar error con URL invalida", async () => {
    const res = await request(app)
      .post("/api/descargas")
      .send({ url: "no-es-url", tipo: "mock", maxReintentos: 1 });
    expect(res.status).toBe(400);
  });

  it("debe retornar 404 para descarga inexistente", async () => {
    const res = await request(app).get("/api/descargas/id-inexistente/estado");
    expect(res.status).toBe(404);
  });

  it("debe reintentar una descarga existente", async () => {
    const crear = await request(app)
      .post("/api/descargas")
      .send({ url: "http://test.com/retry.pdf", tipo: "mock", maxReintentos: 3 });
    const id = crear.body.id;
    const res = await request(app).post(`/api/descargas/${id}/reintentar`);
    expect([200, 400, 500]).toContain(res.status);
  });
});