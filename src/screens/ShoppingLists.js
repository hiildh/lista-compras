import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useNavigate } from "react-router-dom";
import { ShoppingNavBar } from "@/components/ShoppingNavBar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ShoppingBag, Calendar, ChevronRight, Users, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo para listas de compras
const mockLists = [
  { id: "1", name: "Supermercado Semanal", itemCount: 12, completedCount: 5, updatedAt: new Date(), collaborators: ["Maria", "João"] },
  { id: "2", name: "Feira Orgânica", itemCount: 8, completedCount: 8, updatedAt: new Date(Date.now() - 86400000), collaborators: ["Maria", "Carlos"] },
  { id: "3", name: "Papelaria", itemCount: 4, completedCount: 0, updatedAt: new Date(Date.now() - 172800000), collaborators: ["Maria"] },
];

const ShoppingLists = () => {
  const [lists, setLists] = useState(mockLists);
  const [newListName, setNewListName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = {
        id: (lists.length + 1).toString(),
        name: newListName.trim(),
        itemCount: 0,
        completedCount: 0,
        updatedAt: new Date(),
        collaborators: ["Maria"],
      };
      
      setLists([newList, ...lists]);
      setNewListName("");
      setIsCreateSheetOpen(false);
      
      toast({
        title: "Lista criada",
        description: `A lista "${newListName}" foi criada com sucesso!`,
      });
      
      // Navegar para a nova lista
      navigate(`/lists/${newList.id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um nome para a lista",
      });
    }
  };

  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Suas Listas</Text>
          <View style={styles.searchContainer}>
            <Search style={styles.searchIcon} size={18} />
            <TextInput
              placeholder="Buscar lista..."
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {filteredLists.length > 0 ? (
          <ScrollView style={styles.listContainer}>
            {filteredLists.map((list) => (
              <Pressable 
                key={list.id} 
                style={styles.listCard}
                onPress={() => navigate(`/lists/${list.id}`)}
              >
                <View style={styles.listCardHeader}>
                  <View style={styles.listIconContainer}>
                    <View style={styles.iconBackground}>
                      <ShoppingBag size={20} color="#9b87f5" />
                    </View>
                    <View>
                      <Text style={styles.listName}>{list.name}</Text>
                      <Text style={styles.listStatus}>
                        {list.completedCount} de {list.itemCount} itens completos
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#888" />
                </View>
                <View style={styles.listCardFooter}>
                  <View style={styles.metaInfo}>
                    <Calendar size={14} color="#888" />
                    <Text style={styles.metaText}>
                      {list.updatedAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={styles.metaInfo}>
                    <Users size={14} color="#888" />
                    <Text style={styles.metaText}>{list.collaborators.length}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <ShoppingBag size={48} color="#888" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>Nenhuma lista encontrada</Text>
            <Text style={styles.emptyDescription}>
              {searchTerm ? "Tente outra busca ou crie uma nova lista" : "Comece criando sua primeira lista de compras"}
            </Text>
            <Pressable 
              style={styles.createButton}
              onPress={() => setIsCreateSheetOpen(true)}
            >
              <Text style={styles.createButtonText}>Criar Lista</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent side="bottom" className="h-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Nova Lista de Compras</SheetTitle>
          </SheetHeader>
          <View style={styles.sheetContent}>
            <TextInput
              placeholder="Nome da lista (ex: Compras do mês)"
              value={newListName}
              onChangeText={setNewListName}
              style={styles.sheetInput}
            />
            <SheetFooter>
              <Pressable 
                style={styles.sheetButton} 
                onPress={handleCreateList}
              >
                <Text style={styles.sheetButtonText}>Criar Lista</Text>
              </Pressable>
            </SheetFooter>
          </View>
        </SheetContent>
      </Sheet>

      <ShoppingNavBar onCreateList={() => setIsCreateSheetOpen(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 80,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    maxWidth: 500,
    marginHorizontal: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
    color: '#888',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  listContainer: {
    marginBottom: 16,
  },
  listCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eaeaea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: 'rgba(155, 135, 245, 0.1)',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  listName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  listStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  listCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#9b87f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  sheetContent: {
    paddingVertical: 24,
  },
  sheetInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  sheetButton: {
    backgroundColor: '#9b87f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  sheetButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ShoppingLists;
