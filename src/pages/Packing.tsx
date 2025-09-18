import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Package, Plus, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PackingItem {
  id: string;
  name: string;
  category: string;
  is_essential: boolean;
  is_checked: boolean;
  custom_added: boolean;
}

const categories = [
  { value: 'documents', label: 'Documents', icon: '📄', color: 'bg-red-100 text-red-800' },
  { value: 'electronics', label: 'Electronics', icon: '🔌', color: 'bg-blue-100 text-blue-800' },
  { value: 'clothes', label: 'Clothes', icon: '👕', color: 'bg-green-100 text-green-800' },
  { value: 'toiletries', label: 'Toiletries', icon: '🧴', color: 'bg-purple-100 text-purple-800' },
  { value: 'accessories', label: 'Accessories', icon: '🕶️', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'medication', label: 'Medication', icon: '💊', color: 'bg-pink-100 text-pink-800' },
  { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-800' }
];

const Packing: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('packing_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('category')
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching packing items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('packing_items')
        .insert([{
          user_id: user?.id,
          name: newItemName.trim(),
          category: selectedCategory,
          custom_added: true
        }])
        .select()
        .single();

      if (error) throw error;

      setItems(prev => [...prev, data]);
      setNewItemName('');
      toast({
        title: "Item added",
        description: `${newItemName} has been added to your packing list.`
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleItem = async (id: string, isChecked: boolean) => {
    try {
      const { error } = await supabase
        .from('packing_items')
        .update({ is_checked: isChecked })
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_checked: isChecked } : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('packing_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item removed",
        description: "Item has been removed from your packing list."
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetList = async () => {
    try {
      const { error } = await supabase
        .from('packing_items')
        .update({ is_checked: false })
        .eq('user_id', user?.id);

      if (error) throw error;

      setItems(prev => prev.map(item => ({ ...item, is_checked: false })));
      toast({
        title: "List reset",
        description: "All items have been unchecked."
      });
    } catch (error) {
      console.error('Error resetting list:', error);
    }
  };

  const filteredItems = selectedCategoryFilter 
    ? items.filter(item => item.category === selectedCategoryFilter)
    : items;

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.value] = filteredItems.filter(item => item.category === category.value);
    return acc;
  }, {} as Record<string, PackingItem[]>);

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.is_checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your packing list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-ocean text-white p-6 rounded-b-3xl shadow-elegant">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Universal Packing List</h1>
          
          {/* Progress */}
          <div className="bg-white/10 rounded-full h-2 mb-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-sm">
            {checkedItems} of {totalItems} items packed ({progress}%)
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Add New Item */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Item name..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <Button onClick={addItem} disabled={!newItemName.trim()} className="w-full">
              Add Item
            </Button>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategoryFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategoryFilter(null)}
            className="whitespace-nowrap"
          >
            All ({totalItems})
          </Button>
          {categories.map(category => {
            const count = items.filter(item => item.category === category.value).length;
            if (count === 0) return null;
            
            return (
              <Button
                key={category.value}
                variant={selectedCategoryFilter === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategoryFilter(category.value)}
                className="whitespace-nowrap"
              >
                {category.icon} {category.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Items by Category */}
        <div className="space-y-4">
          {categories.map(category => {
            const categoryItems = groupedItems[category.value];
            if (!categoryItems || categoryItems.length === 0) return null;

            const checkedCount = categoryItems.filter(item => item.is_checked).length;

            return (
              <Card key={category.value}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <CardTitle className="text-lg">{category.label}</CardTitle>
                    </div>
                    <Badge className={category.color}>
                      {checkedCount}/{categoryItems.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox
                          id={item.id}
                          checked={item.is_checked}
                          onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 cursor-pointer transition-opacity ${
                            item.is_checked ? 'line-through opacity-60' : ''
                          }`}
                        >
                          {item.name}
                          {item.is_essential && (
                            <Badge variant="secondary" className="ml-2 text-xs">Essential</Badge>
                          )}
                        </label>
                      </div>
                      {item.custom_added && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        {items.length > 0 && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetList} className="flex-1">
              Reset All
            </Button>
            {progress === 100 && (
              <Card className="flex-1 bg-green-50 border-green-200">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-green-800">All Packed!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {items.length === 0 && (
          <Card className="text-center p-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No items in your list</h3>
            <p className="text-muted-foreground">
              Add items to your universal packing list to never forget the essentials.
            </p>
          </Card>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Packing;