import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/database/firebase_config"

export async function getDashboardMetrics() {
  const ordersSnap = await getDocs(collection(db, "orders"))
  const artistsSnap = await getDocs(collection(db, "artists"))
  const productsSnap = await getDocs(collection(db, "products"))

  const totalSales = ordersSnap.docs.reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0)
  const pendingOrders = ordersSnap.docs.filter((doc) => doc.data().status.currentStatus === "Pendente").length
  const totalArtists = artistsSnap.docs.length
  const totalProducts = productsSnap.docs.length

  return { totalSales, pendingOrders, totalArtists, totalProducts }
}

export async function getLatestOrders() {
  const q = query(collection(db, "orders"), where("status.currentStatus", "!=", "Cancelado"))
  const ordersSnap = await getDocs(q)

  return ordersSnap.docs.slice(0, 5).map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      clientName: data.cliente?.name || "Desconhecido",
      status: data.status.currentStatus || "Pendente",
      total: data.totalPrice || 0,
    }
  })
}
