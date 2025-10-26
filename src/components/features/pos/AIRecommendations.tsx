'use client';
import { useEffect, useState, useMemo } from 'react';
import { useCart } from '@/contexts/CartContext';
import { getProductRecommendations, ProductRecommendationsOutput } from '@/ai/flows/ai-product-recommendations';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/lib/data';
import type { Product } from '@/types';

export function AIRecommendations() {
    const { cartItems, addToCart } = useCart();
    const [recommendations, setRecommendations] = useState<ProductRecommendationsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const cartItemsString = useMemo(() => cartItems.map(item => item.product.id + item.quantity).join(), [cartItems]);

    useEffect(() => {
        if (cartItems.length > 0) {
            const fetchRecommendations = async () => {
                setIsLoading(true);
                try {
                    const transactionHistory = cartItems.map(item => `${item.quantity}x ${item.product.name} (ID: ${item.product.id})`).join(', ');
                    const result = await getProductRecommendations({ transactionHistory });
                    setRecommendations(result);
                } catch (error) {
                    console.error("AI Recommendation Error:", error);
                    toast({
                        variant: 'destructive',
                        title: 'Could not fetch AI recommendations.'
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            // Debounce the call
            const handler = setTimeout(() => {
                fetchRecommendations();
            }, 1000);
            return () => clearTimeout(handler);
        } else {
            setRecommendations(null);
        }
    }, [cartItems, cartItemsString, toast]);

    const handleAddRecommended = (productCode: string) => {
        const productToAdd = products.find(p => p.id === productCode);
        if (productToAdd) {
            addToCart(productToAdd);
        } else {
            toast({
                variant: 'destructive',
                title: 'Product not found',
                description: `Product with code ${productCode} could not be added.`
            });
        }
    }

    if (!recommendations || recommendations.recommendedProducts.length === 0) {
        if (isLoading) {
            return (
                <div className="flex items-center gap-2 border-t p-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                </div>
            );
        }
        return null;
    }
    
    // Filter recommendations to find actual products in our mock DB and avoid recommending items already in cart
    const validRecommendedProducts = recommendations.recommendedProducts
      .map(code => products.find(p => p.id === code))
      .filter((p): p is Product => !!p && !cartItems.some(item => item.product.id === p.id));

    if (validRecommendedProducts.length === 0) return null;

    return (
        <div className="border-t p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Wand2 className="h-4 w-4 text-primary" />
                <span>AI Recommendations</span>
            </h4>
            <p className="mb-3 text-xs text-muted-foreground">{recommendations.reasoning}</p>
            <div className="flex flex-wrap gap-2">
                {validRecommendedProducts.map(product => (
                    <Button
                        key={product.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddRecommended(product.id)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {product.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}
