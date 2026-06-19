import { describe, it, expect } from "vitest";
import { UrlDescarga, UrlInvalidaError, Descarga, DescargaError } from "../../domain/Descarga";

describe("UrlDescarga - Value Object", () => {
  it("debe aceptar URL http valida", () => {
    expect(() => new UrlDescarga("http://example.com/file.pdf")).not.toThrow();
  });

  it("debe aceptar URL ftp valida", () => {
    expect(() => new UrlDescarga("ftp://files.example.com/data.zip")).not.toThrow();
  });

  it("debe aceptar URL mock valida", () => {
    expect(() => new UrlDescarga("mock://test/file")).not.toThrow();
  });

  it("debe rechazar URL sin protocolo", () => {
    expect(() => new UrlDescarga("example.com/file")).toThrow(UrlInvalidaError);
  });

  it("debe rechazar URL vacia", () => {
    expect(() => new UrlDescarga("")).toThrow(UrlInvalidaError);
  });

  it("debe rechazar URL con protocolo invalido", () => {
    expect(() => new UrlDescarga("xyz://invalid")).toThrow(UrlInvalidaError);
  });

  it("debe exponer el valor correctamente", () => {
    const url = new UrlDescarga("http://example.com");
    expect(url.valor).toBe("http://example.com");
  });
});

describe("Descarga - Entidad", () => {
  it("debe crearse con estado pending", () => {
    const d = new Descarga("1", "http://test.com", "mock", 3);
    expect(d.estado).toBe("pending");
    expect(d.progreso).toBe(0);
    expect(d.intentos).toBe(0);
  });

  it("debe actualizar progreso correctamente", () => {
    const d = new Descarga("1", "http://test.com", "mock", 3);
    d.actualizarProgreso(50);
    expect(d.progreso).toBe(50);
    expect(d.estado).toBe("in_progress");
  });

  it("debe completarse cuando progreso llega a 100", () => {
    const d = new Descarga("1", "http://test.com", "mock", 3);
    d.actualizarProgreso(100);
    expect(d.estado).toBe("completed");
    expect(d.progreso).toBe(100);
  });

  it("debe marcarse como error correctamente", () => {
    const d = new Descarga("1", "http://test.com", "mock", 3);
    d.marcarComoError("Timeout");
    expect(d.estado).toBe("error");
    expect(d.error).toBe("Timeout");
    expect(d.intentos).toBe(1);
  });

  it("debe reiniciarse correctamente tras error", () => {
    const d = new Descarga("1", "http://test.com", "mock", 3);
    d.marcarComoError("fallo");
    d.reiniciar();
    expect(d.estado).toBe("pending");
    expect(d.progreso).toBe(0);
  });

  it("debe lanzar error si se reinicia con max reintentos alcanzado", () => {
    const d = new Descarga("1", "http://test.com", "mock", 1);
    d.marcarComoError("fallo");
    expect(() => d.reiniciar()).toThrow();
  });
});

describe("DescargaError - Jerarquia de errores", () => {
  it("UrlInvalidaError debe ser instancia de DescargaError", () => {
    const err = new UrlInvalidaError();
    expect(err).toBeInstanceOf(DescargaError);
    expect(err).toBeInstanceOf(Error);
  });

  it("UrlInvalidaError debe tener nombre correcto", () => {
    const err = new UrlInvalidaError();
    expect(err.name).toBe("UrlInvalidaError");
  });
});