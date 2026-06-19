import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../../../server";

describe("E2E: Flujo Completo de Descarga", () => {

  it("flujo completo: crear descarga mock y verificar que aparece en lista", async () => {
    const crear = await request(app)
      .post("/api/descargas")
      .send({ url: "http://mock.test/file.zip", tipo: "mock", maxReintentos: 1 });
    expect(crear.status).toBe(201);
    const id = crear.body.id;

    const lista = await request(app).get("/api/descargas");
    expect(lista.status).toBe(200);
    const encontrada = lista.body.find((d: any) => d.id === id);
    expect(encontrada).toBeDefined();

    const estado = await request(app).get(`/api/descargas/${id}/estado`);
    expect(estado.status).toBe(200);
    expect(["pending", "in_progress", "completed", "error"]).toContain(estado.body.estado);
  });

  it("flujo: URL invalida devuelve error 400 con mensaje", async () => {
    const res = await request(app)
      .post("/api/descargas")
      .send({ url: "esto-no-es-url", tipo: "mock", maxReintentos: 1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("flujo: descarga inexistente devuelve 404", async () => {
    const res = await request(app).get("/api/descargas/no-existe-este-id/estado");
    expect(res.status).toBe(404);
  });

  it("flujo: crear multiples descargas y listar todas", async () => {
    await request(app).post("/api/descargas").send({ url: "http://mock.test/a.zip", tipo: "mock", maxReintentos: 1 });
    await request(app).post("/api/descargas").send({ url: "http://mock.test/b.zip", tipo: "mock", maxReintentos: 1 });
    await request(app).post("/api/descargas").send({ url: "http://mock.test/c.zip", tipo: "mock", maxReintentos: 1 });

    const lista = await request(app).get("/api/descargas");
    expect(lista.status).toBe(200);
    expect(lista.body.length).toBeGreaterThanOrEqual(3);
  });

  it("flujo: reintentar descarga que no esta en error devuelve error", async () => {
    const crear = await request(app)
      .post("/api/descargas")
      .send({ url: "http://mock.test/retry.zip", tipo: "mock", maxReintentos: 3 });
    const id = crear.body.id;

    const res = await request(app).post(`/api/descargas/${id}/reintentar`);
    expect([400, 500]).toContain(res.status);
  });
});