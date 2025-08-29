# Simulador de Porto

- Projeto realizado para a Disciplina de Simulação e Avaliação de Software

---

## 🚀 Tecnologias Utilizadas

- **React**: Biblioteca principal para a construção da interface de usuário.
- **Vite**: Framework _React_ para estrutura do Frontend.
- **Tailwind CSS**: Framework de CSS para estilização rápida e atrativa.
- **Python**: Para a lógica de Backend.
- **SimPy**: Biblioteca que realiza o cálculo de simulação das Filas.
- **FastAPI**: Comunicação RestAPI entre Front e Backend.

---

## 📂 Estrutura do Projeto

O código-fonte está organizado da seguinte forma:

```
📦porto-simulator
 ┣ 📂backend
 ┃ ┣ 📂app
 ┃ ┃ ┣ 📜main.py
 ┃ ┃ ┣ 📜models.py
 ┃ ┃ ┗ 📜simulation.py
 ┃ ┣ 📂venv
 ┃ ┗ 📜requirements.txt
 ┣ 📂frontend
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜Controls.jsx
 ┃ ┃ ┃ ┣ 📜Game.jsx
 ┃ ┃ ┃ ┗ 📜Stats.jsx
 ┃ ┃ ┣ 📂screens
 ┃ ┃ ┃ ┗ 📜Home.jsx
 ┃ ┃ ┣ 📂styles
 ┃ ┃ ┃ ┗ 📜index.css
 ┃ ┃ ┗ 📜App.jsx
 ┗ 📜README.md
```

---

## ⚙️ Scripts Úteis

### ⚡ Executar o projeto

1.  **Abra dois terminais em sua máquina**

2.  **Em um deles, navegue até `/frontend`, instale as dependências e execute o Vite:**
    ```bash
    cd frontend
    npm install
    ```

3.  **No outro, navegue até `/backend`, crie e inicialize o ambiente virtual, instale as dependências e execute o servidor uvicorn:**
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

> Coded by `@ItalloEduardo`