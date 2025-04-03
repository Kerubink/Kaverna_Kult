import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 

const ArtistLoginForm = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [showVerifyMessage, setShowVerifyMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setStatusMessage("");
    setShowVerifyMessage(false);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setShowVerifyMessage(true);
        setUserEmail(user.email);
        throw new Error("E-mail não verificado.");
      }

      const db = getFirestore();
      const artistDocRef = doc(db, "artists_pending", user.uid);
      const artistDoc = await getDoc(artistDocRef);

      if (artistDoc.exists()) {
        const artistData = artistDoc.data();
        if (artistData.status === "pending") {
          setStatusMessage("Seu perfil ainda está em análise. Aguarde a aprovação.");
        } else if (artistData.status === "accepted") {
          navigate(`/artist/${user.uid}`);
        }
      } else {
        setLoginError("Perfil não encontrado ou dados inválidos.");
      }
    } catch (error) {
      if (error.message === "E-mail não verificado.") {
        setLoginError("Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada.");
      } else {
        setLoginError("Perfil não encontrado ou dados inválidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetMessage("Digite um e-mail válido.");
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      setResetMessage("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await sendEmailVerification(user);
        setStatusMessage("E-mail de verificação reenviado! Verifique sua caixa de entrada.");
      }
    } catch (error) {
      setStatusMessage("Erro ao reenviar e-mail de verificação.");
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-3">
        <CardTitle>Login de Artista</CardTitle>
        <CardDescription>Entre no seu painel para acessar suas configurações</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmitLogin} className="w-full">
        <CardContent className="p-3">
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleChangeLogin}
              required
              className="w-full p-3 bg-white border border-gray-300 text-black rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleChangeLogin}
              required
              className="w-full p-3 bg-white border border-gray-300 text-black rounded-lg"
            />
          </div>

          <button type="button" onClick={() => setShowResetPopup(true)} className="text-sm text-blue-400 hover:underline">
            Esqueci minha senha
          </button>

          {loginError && <p className="text-red-500 text-center my-4">{loginError}</p>}
          {statusMessage && <p className="text-yellow-400 text-center my-4">{statusMessage}</p>}
        </CardContent>
        <CardFooter className="p-3 flex flex-col items-start gap-2">
          <Button type="submit" disabled={loading} className="bg-gradient-to-bl from-violet-500 to-fuchsia-500 p-3 text-white rounded-lg hover:text-white transition disabled:bg-gray-300">
            {loading ? "Carregando..." : "Entrar"}
          </Button>

          {/* Se o e-mail não estiver verificado, exibir botão para reenviar verificação */}
         
        </CardFooter>
      </form>

      {/* Popup de recuperação de senha */}
      {showResetPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-3">Recuperação de Senha</h2>
            <p className="text-gray-500 text-sm mb-4">Digite seu e-mail para receber um link de redefinição de senha.</p>
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            {resetMessage && <p className="text-sm text-red-500 mb-3">{resetMessage}</p>}
            <div className="flex justify-between">
              <Button onClick={handleResetPassword} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                Enviar E-mail
              </Button>
              <Button onClick={() => setShowResetPopup(false)} className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ArtistLoginForm;
