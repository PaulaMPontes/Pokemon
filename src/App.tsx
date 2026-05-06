import { useEffect, useState } from "react";
import { api } from "./services/api";

type PokemonListItem = {
  name: string;
  url: string;
};

type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
};

function App() {
  const [list, setList] = useState<PokemonListItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [details, setDetails] = useState<Record<number, PokemonDetails>>({});

  useEffect(() => {
    api.get("/pokemon?limit=20")
      .then(res => setList(res.data.results));
  }, []);

  const getIdFromUrl = (url: string) => {
    const parts = url.split("/");
    return Number(parts[parts.length - 2]);
  };

  const handleClick = async (id: number) => {
    if (selected === id) {
      setSelected(null);
      return;
    }

    setSelected(id);

    if (details[id]) return;

    try {
      const res = await api.get(`/pokemon/${id}`);
      setDetails(prev => ({
        ...prev,
        [id]: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pokédex</h1>

      <div
        style={{
          columnCount: 4,
          columnGap: 20,
        }}
      >
        {list.map((p) => {
          const id = getIdFromUrl(p.url);
          const data = details[id];
          const isOpen = selected === id;

          return (
            <div
              key={id}
              onClick={() => handleClick(id)}
              style={{
                breakInside: "avoid",
                marginBottom: 20,
                borderRadius: 12,
                padding: 15,
                background: "#f5f5f5",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <h3 style={{ textTransform: "capitalize" }}>
                #{id} {p.name}
              </h3>

              {isOpen && (
                <div style={{ textAlign: "center" }}>
                  {!data ? (
                    <p>Carregando...</p>
                  ) : (
                    <>
                      <img
                        src={data.sprites.front_default}
                        style={{ width: 100 }}
                      />
                      <p>Altura: {data.height}</p>
                      <p>Peso: {data.weight}</p>
                      <p>
                        Tipos:{" "}
                        {data.types.map((t) => t.type.name).join(", ")}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;